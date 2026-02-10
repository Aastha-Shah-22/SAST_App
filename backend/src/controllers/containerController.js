const path = require("path");
const fs = require("fs").promises;
const util = require('util');
const { exec } = require("child_process");
const execPromise = util.promisify(exec);
const VulReport = require('../model/schema.js');
const mongoose = require('mongoose');

async function runContainerScan(req, res) {
  const { clientName, imageName } = req.body;

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
    console.log(jsonReport);

    // 4. Summarize Results
    let totalVulnerabilities = 0;
    let totalMisconfigs = 0;

    if (jsonReport.Results) {
      jsonReport.Results.forEach(res => {
        totalVulnerabilities += res.Vulnerabilities?.length || 0;
        totalMisconfigs += res.Misconfigurations?.length || 0;
      });
    }

    try{
      await VulReport.create({
        _id: new mongoose.Types.ObjectId(),
        client_name: clientName,
        scan_id: scanId,
        scan_type: 'Container',
        scan_status: 'completed',
        report: jsonReport,
      });

      console.log('Container scan report saved successfully');
    }catch(err){
      console.error('Error saving container scan report:', err);
      throw new Error('Failed to connect to database');
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
  }
};

module.exports = { runContainerScan };