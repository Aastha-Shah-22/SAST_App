const express = require('express');
const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs').promises;
const execPromise = util.promisify(exec);
const PORT = 3001;
const app = express();

app.use(express.json());

app.post('/api/scan', async (req, res) => {
  const { repoUrl, gitUsername, gitToken, semgrepToken, branch = 'main' } = req.body;

  if (!repoUrl || !semgrepToken) {
    return res.status(400).json({ error: 'Repository URL and Semgrep token are required' });
  }

  const scanId = Date.now().toString();
  const workDir = path.resolve(__dirname, 'scans', scanId);
  const reportsDir = path.join(workDir, 'reports');
  const repoPath = path.join(workDir, 'repo');

  try {
    // 1. Create directories
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(reportsDir, { recursive: true });

    // 2. Build Auth URL
    let authRepoUrl = repoUrl;
    if (gitUsername && gitToken) {
      const url = new URL(repoUrl);
      authRepoUrl = `${url.protocol}//${gitUsername}:${gitToken}@${url.host}${url.pathname}`;
    }

    console.log(`Cloning into: ${repoPath}`);
    await execPromise(`git clone --depth 1 --branch ${branch} ${authRepoUrl} .`, { cwd: repoPath });

    console.log('Running Semgrep scan...');

    // 3. Robust Docker Command
    // -w /src: Sets the working directory inside the container
    // --user $(id -u): Optional, ensures the report file isn't owned by 'root'
    const reportFile = 'semgrep-report.json';
    const dockerCmd = `docker run --rm \
      -v "${repoPath}:/src" \
      -v "${reportsDir}:/reports" \
      -w /src \
      -e SEMGREP_APP_TOKEN=${semgrepToken} \
      semgrep/semgrep:latest \
      semgrep scan --config auto --json --output /reports/${reportFile}`;

    try {
      // Use a slightly larger maxBuffer in case the output is huge
      await execPromise(dockerCmd, { timeout: 300000, maxBuffer: 1024 * 1024 * 10 });
      console.log("Semgrep finished with 0 findings.");
    } catch (cmdError) {
      // Semgrep returns 1 if findings are found; we only throw if the file is missing
      const reportPath = path.join(reportsDir, reportFile);
      try {
        await fs.access(reportPath);
        console.log('Semgrep completed with findings.');
      } catch (e) {
        throw new Error(`Semgrep failed and no report was generated: ${cmdError.message}`);
      }
    }

    // 4. Read and Parse
    const jsonContent = await fs.readFile(path.join(reportsDir, reportFile), 'utf-8');
    const jsonReport = JSON.parse(jsonContent);

    res.json({
      success: true,
      scanId,
      summary: {
        totalFindings: jsonReport.results?.length || 0,
        errors: jsonReport.errors?.length || 0,
        pathsScanned: jsonReport.paths?.scanned?.length || 0
      }
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      error: 'Scan failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
  finally {
    // Optional: Clean up the working directory after scan
     await fs.rm(repoPath, { recursive: true });
  }
});

app.listen(PORT, () => {
  console.log(`Semgrep Scanner API running on port ${PORT}`);
});