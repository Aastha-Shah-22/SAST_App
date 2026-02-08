const path = require("path");
const fs = require("fs").promises;
const util = require('util');
const { exec } = require("child_process");
const execPromise = util.promisify(exec);
const cors = require("cors");

async function runContainerScan(req, res) {
  const { imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ error: 'Image name (e.g., "alpine:latest") is required' });
  }

  const scanId = Date.now().toString();
  const workDir = path.resolve(__dirname, "..", "scans", `trivy-${scanId}`);
  const reportsDir = path.join(workDir, 'reports');
  const reportFile = 'trivy-report.json';
  const reportPath = path.join(reportsDir, reportFile);

  try {
    // 1. Create directory for the report
    await fs.mkdir(reportsDir, { recursive: true });

    console.log(`Starting Trivy scan for image: ${imageName}`);

    const dockerCmd = `docker run --rm \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v "${reportsDir}:/reports" \
      -v trivy-cache:/root/.cache/ \
      aquasec/trivy:latest \
      image --format json --output /reports/${reportFile} \
      --scanners vuln,misconfig \
      --image-config-scanners misconfig \
      ${imageName}`;

    await execPromise(dockerCmd, { timeout: 300000, maxBuffer: 1024 * 1024 * 20 });

    // 3. Read and Parse the report
    const jsonContent = await fs.readFile(reportPath, 'utf-8');
    const jsonReport = JSON.parse(jsonContent);

    // 4. Summarize Results
    let totalVulnerabilities = 0;
    let totalMisconfigs = 0;

    if (jsonReport.Results) {
      jsonReport.Results.forEach(res => {
        totalVulnerabilities += res.Vulnerabilities?.length || 0;
        totalMisconfigs += res.Misconfigurations?.length || 0;
      });
    }

    res.json({
      success: true,
      scanId,
      image: imageName,
      summary: {
        totalVulnerabilities,
        totalMisconfigs,
      },
      details: jsonReport.Results 
    });

  } catch (error) {
    console.error('Trivy Scan error:', error);
    res.status(500).json({ 
      error: 'Container scan failed', 
      details: error.message 
    });
  } finally {
    // await fs.rm(workDir, { recursive: true, force: true });
  }
};

module.exports = { runContainerScan };