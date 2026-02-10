const path = require("path");
const fs = require("fs").promises;
const util = require('util');
const { exec } = require("child_process");
const execPromise = util.promisify(exec);
const VulReport = require('../model/schema.js');
const mongoose = require('mongoose');

async function runSastScan(req, res) {
  const { clientName, repoUrl, gitUsername, gitToken, semgrepToken, branch = 'main' } = req.body;

  if (!repoUrl || !semgrepToken) {
    return res.status(400).json({ error: 'Repository URL and Semgrep token are required' });
  }

  const scanId = Date.now().toString();
  const workDir = path.resolve(__dirname, "..", "scans", scanId);
  const reportsDir = path.join(workDir, "reports");
  const repoPath = path.join(workDir, "repo");
  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(reportsDir, { recursive: true });

    //Build Auth URL
    let authRepoUrl = repoUrl;
    if (gitUsername && gitToken) {
      const url = new URL(repoUrl);
      authRepoUrl = `${url.protocol}//${gitUsername}:${gitToken}@${url.host}${url.pathname}`;
    }

    console.log(`Cloning into: ${repoPath}`);
    await execPromise(`git clone --depth 1 --branch ${branch} ${authRepoUrl} .`, { cwd: repoPath });

    console.log('Running Semgrep scan...');

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

    let status = "failed";
    let reportContent = null; 
    try {
      await execPromise(dockerCmd, { timeout: 300000, maxBuffer: 1024 * 1024 * 10 });
      console.log("Semgrep finished with 0 findings.");
      status = 'completed';

    } catch (cmdError) {
      console.log("In catch block") ;     
    }

      const reportPath = path.join(reportsDir, reportFile);
      status = 'completed';
      try {
        await fs.access(reportPath);
        console.log('Semgrep completed with findings.');
        const jsonContent = await fs.readFile(reportPath, "utf-8");
        const jsonReport = JSON.parse(jsonContent);
        console.log(jsonReport);
        reportContent = jsonReport;
      } catch (e) {
        console.log("No jsonReport Generated");
      }

    try{
      console.log('Saving report to database...');
      await VulReport.create({
        _id: new mongoose.Types.ObjectId(),
        client_name: clientName,
        scan_id: scanId,
        scan_type: 'SAST',
        scan_remediated_status: 'in_progress',
        scan_status: status,
        report: reportContent,
      });
      console.log('Report saved successfully');
    }
    catch(err){
      console.error('Database connection failed:', err);
      throw new Error('Failed to connect to database');
    }

    const report = {
      success: true,
      scanId,
      clientName,
      repoUrl,
      summary: {
        totalFindings: reportContent?.results?.length || 0,
        errors: reportContent?.errors?.length || 0,
        pathsScanned: reportContent?.paths?.scanned?.length || 0
      }
    };

    res.json(report);

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      error: 'Scan failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
  finally {
     await fs.remove(workDir, { recursive: true });
  }
};

module.exports =  { runSastScan };
