const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 1. Setup specific test variables
const REPO_URL = "https://github.com/juice-shop/juice-shop.git"; // Using a known vulnerable repo
const SCAN_ID = "debug_test";
const WORK_DIR = path.join(__dirname, 'scans', SCAN_ID);
const REPO_PATH = path.join(WORK_DIR, 'repo');
const REPORT_DIR = path.join(WORK_DIR, 'reports');

// Helper to fix Windows paths (CRITICAL FOR DOCKER)
const toDockerPath = (p) => {
    // 1. Resolve to absolute path
    const absolute = path.resolve(p);
    // 2. Convert backslashes to forward slashes
    let dockerPath = absolute.replace(/\\/g, '/');
    // 3. (Optional) Handle drive letter lowercasing if needed, but usually this is enough
    return dockerPath;
};

async function runDebug() {
    console.log("=== STARTING DEBUG SCAN ===");
    console.log("1. Setting up directories...");
    
    if (fs.existsSync(WORK_DIR)) {
        console.log("   Cleaning up old debug folder...");
        fs.rmSync(WORK_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(REPORT_DIR, { recursive: true });

    console.log("2. Cloning repository...");
    // We use a simple git clone here
    const gitProcess = spawn('git', ['clone', '--depth', '1', REPO_URL, REPO_PATH], { shell: true });
    
    await new Promise((resolve) => gitProcess.on('close', resolve));
    console.log("   Clone complete.");

    console.log("3. Preparing Docker Command...");
    const srcPath = toDockerPath(REPO_PATH);
    const reportPath = toDockerPath(REPORT_DIR);
    
    console.log(`   Expected Input: ${srcPath}`);
    console.log(`   Expected Output: ${reportPath}`);

    // The actual Docker command
    const args = [
        'run', '--rm',
        '-v', `${srcPath}:/src`,
        '-v', `${reportPath}:/reports`,
        'semgrep/semgrep',
        'semgrep', 'scan',
        '--config', 'p/security-audit',
        '--json',
        '--output', '/reports/report.json',
        '--verbose' // This ensures we see errors
    ];

    console.log("4. Running Docker...");
    console.log(`   Command: docker ${args.join(' ')}`);

    const docker = spawn('docker', args, { shell: true });

    // Stream Output directly to console
    docker.stdout.on('data', (d) => process.stdout.write(d.toString()));
    docker.stderr.on('data', (d) => process.stderr.write(d.toString()));

    docker.on('close', (code) => {
        console.log(`\n=== DOCKER FINISHED WITH CODE ${code} ===`);
        
        // Check if file exists
        const outputFile = path.join(REPORT_DIR, 'report.json');
        if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            console.log(`SUCCESS! Report generated at: ${outputFile}`);
            console.log(`File size: ${stats.size} bytes`);
        } else {
            console.error("FAILURE: Docker finished but no report file was found.");
            console.error("Possible causes: ");
            console.error(" - Docker File Sharing is disabled for C: drive");
            console.error(" - Antivirus blocked the volume mount");
        }
    });
}

runDebug();