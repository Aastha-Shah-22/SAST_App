const express = require('express');
const { spawn } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const fsSync = require('fs'); // We need sync fs for existsSync checks if needed
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- CRITICAL HELPER: Fix Windows paths for Docker ---
// Converts "C:\Users\..." to "C:/Users/..." so Docker doesn't get confused
const cleanPath = (p) => {
    return path.resolve(p).replace(/\\/g, '/');
};

app.post('/api/scan', async (req, res) => {
    const { repoUrl, branch = 'main' } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Generate unique ID for this scan
    const scanId = Date.now().toString();
    const workDir = path.join(__dirname, 'scans', scanId);
    const repoPath = path.join(workDir, 'repo');
    const reportsDir = path.join(workDir, 'reports');

    console.log(`[${scanId}] Starting scan for ${repoUrl}`);

    try {
        // 1. Create Directories
        await fs.mkdir(reportsDir, { recursive: true });

        // 2. Clone Repository
        console.log(`[${scanId}] Cloning...`);
        
        // We wrap spawn in a Promise so we can "await" it
        await new Promise((resolve, reject) => {
            const git = spawn('git', ['clone', '--depth', '1', '--branch', branch, repoUrl, repoPath], { shell: true });
            git.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Git clone failed with code ${code}`));
            });
        });

        // 3. Prepare Docker Command (Exact match to your working debug script)
        const srcPath = cleanPath(repoPath);
        const reportPath = cleanPath(reportsDir);

        console.log(`[${scanId}] Running Semgrep Docker...`);
        const dockerArgs = [
            'run', '--rm',
            '-v', `${srcPath}:/src`,
            '-v', `${reportPath}:/reports`,
            'semgrep/semgrep',
            'semgrep', 'scan',
            '--config', 'p/security-audit', // The config that worked for you
            '--json',
            '--output', '/reports/report.json',
            '--verbose'
        ];

        // 4. Execute Docker
        await new Promise((resolve, reject) => {
            const docker = spawn('docker', dockerArgs, { shell: true });
            
            // Log output to server console for debugging
            docker.stdout.on('data', (d) => console.log(`[Docker]: ${d.toString().trim()}`));
            docker.stderr.on('data', (d) => console.error(`[Docker Err]: ${d.toString().trim()}`));

            docker.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Docker exited with code ${code}`));
            });
        });

        // 5. Read the Results
        const reportFile = path.join(reportsDir, 'report.json');
        
        // Verify file exists
        try {
            await fs.access(reportFile);
        } catch (e) {
            throw new Error('Scan finished but no report file was found.');
        }

        const reportData = await fs.readFile(reportFile, 'utf8');
        const jsonResult = JSON.parse(reportData);

        console.log(`[${scanId}] Success! Found ${jsonResult.results.length} issues.`);

        // 6. Send to Frontend
        res.json({
            success: true,
            scanId: scanId,
            timestamp: new Date(),
            repoUrl: repoUrl,
            findingsCount: jsonResult.results.length,
            results: jsonResult.results // <--- This is the array your frontend needs
        });

    } catch (error) {
        console.error(`[${scanId}] Failed:`, error);
        res.status(500).json({ 
            error: 'Scan failed', 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Semgrep API ready on http://localhost:${PORT}`);
});