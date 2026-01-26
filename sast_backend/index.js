const express = require('express');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const execPromise = util.promisify(exec);
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to run Semgrep scan
app.post('/api/scan', async (req, res) => {
  const { 
    repoUrl, 
    gitUsername, 
    gitToken, 
    semgrepToken,
    branch = 'main'
  } = req.body;

  if (!repoUrl || !semgrepToken) {
    return res.status(400).json({ 
      error: 'Repository URL and Semgrep token are required' 
    });
  }

  const scanId = Date.now().toString();
  const workDir = path.join(__dirname, 'scans', scanId);
  const reportsDir = path.join(workDir, 'reports');

  try {
    // Create working directories
    await fs.mkdir(reportsDir, { recursive: true });

    // Build authenticated repo URL if credentials provided
    let authRepoUrl = repoUrl;
    if (gitUsername && gitToken) {
      const url = new URL(repoUrl);
      authRepoUrl = `${url.protocol}//${gitUsername}:${gitToken}@${url.host}${url.pathname}`;
    }

    // Clone repository
    console.log(`Cloning repository: ${repoUrl}`);
    await execPromise(`git clone --depth 1 --branch ${branch} ${authRepoUrl} repo`, {
      cwd: workDir,
      timeout: 120000
    });

    const repoPath = path.join(workDir, 'repo');

    // Pull Semgrep Docker image
    console.log('Pulling Semgrep Docker image...');
    await execPromise('docker pull semgrep/semgrep:latest');

    // Run Semgrep scan
    console.log('Running Semgrep scan...');

    const textCmd = `
        docker run --rm ^
        -v "${repoPath}:/src" ^
        -v "${reportsDir}:/reports" ^
        -w /src ^
        semgrep/semgrep ^
        semgrep scan --config auto --output /reports/semgrep-report.json`;

    await execPromise(textCmd, { timeout: 300000 });
    res.json({ success: true, scanId });


    // Read reports
//     let jsonReport = null;
//     let textReport = null;

//     try {
//       const jsonContent = await fs.readFile(
//         path.join(reportsDir, 'semgrep-report.json'), 
//         'utf-8'
//       );
//       jsonReport = JSON.parse(jsonContent);
//     } catch (err) {
//       console.error('Error reading JSON report:', err.message);
//     }

//     try {
//       textReport = await fs.readFile(
//         path.join(reportsDir, 'semgrep-report.txt'), 
//         'utf-8'
//       );
//     } catch (err) {
//       console.error('Error reading text report:', err.message);
//     }

//     // Cleanup
//     await execPromise(`rm -rf ${workDir}`);

//     res.json({
//       success: true,
//       scanId,
//       reports: {
//         json: jsonReport,
//         text: textReport
//       },
//       summary: jsonReport ? {
//         totalFindings: jsonReport.results?.length || 0,
//         errors: jsonReport.errors?.length || 0
//       } : null
//     });

   } catch (error) {
     console.error('Scan error:', error);
    
//     // Cleanup on error
//     try {
//       await execPromise(`rm -rf ${workDir}`);
//     } catch (cleanupErr) {
//       console.error('Cleanup error:', cleanupErr);
//     }

    res.status(500).json({ 
      error: 'Scan failed', 
      details: error.message 
    });
    }
});

// Download report endpoint
app.get('/api/download/:scanId/:format', async (req, res) => {
  const { scanId, format } = req.params;
  const reportsDir = path.join(__dirname, 'scans', scanId, 'reports');
  const filename = format === 'json' 
    ? 'semgrep-report.json' 
    : 'semgrep-report.txt';
  
  const filePath = path.join(reportsDir, filename);

  try {
    await fs.access(filePath);
    res.download(filePath, filename);
  } catch (error) {
    res.status(404).json({ error: 'Report not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Semgrep Scanner API running on port ${PORT}`);
});