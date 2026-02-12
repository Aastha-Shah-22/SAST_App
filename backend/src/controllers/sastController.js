const path = require("path");
const fs = require("fs").promises;
const util = require('util');
const { exec } = require("child_process");
const execPromise = util.promisify(exec);
const VulReport = require('../model/schema.js');
const mongoose = require('mongoose');
const { addToQueue } = require('./queue.js');

async function runSastScan(req, res) {
  const { clientName, repoUrl, gitUsername, gitToken, semgrepToken, branch = 'main' } = req.body;

  if (!repoUrl || !semgrepToken) {
    return res.status(400).json({ error: 'Repository URL and Semgrep token are required' });
  }

  const scanId = Date.now().toString();
  const dbId = new mongoose.Types.ObjectId();
  try {

     //create a pendng task 
    await VulReport.create({
        _id: dbId,
        client_name: clientName,
        scan_id: scanId,
        scan_type: 'SAST',
        scan_remediated_status: 'in_progress',
        scan_status: 'pending',
        report: null,
      });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      error: 'Scan failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }

  const scanTask = async() => {

      const workDir = path.resolve(__dirname, "..", "scans", scanId);
      const reportsDir = path.join(workDir, "reports");
      const repoPath = path.join(workDir, "repo");

      try{

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

        await execPromise(dockerCmd, { timeout: 300000, maxBuffer: 1024 * 1024 * 10 });
        console.log("Semgrep finished with 0 findings.");
        status = 'completed';

        const reportPath = path.join(reportsDir, reportFile);
    
        await fs.access(reportPath);
        console.log('Semgrep completed with findings.');
        const jsonContent = await fs.readFile(reportPath, "utf-8");
        const jsonReport = JSON.parse(jsonContent);
        console.log(jsonReport);
        reportContent = jsonReport;

        await VulReport.findByIdAndUpdate(dbId, { scan_status: 'completed', finished_at: new Date(), report: reportContent });
        console.log("UpdatedDb, ", dbId);
      }catch (error) {
        console.error(`[Scan Error ${dbId}]:`, error.message);
        await VulReport.findByIdAndUpdate(dbId, {
          scan_status: 'failed',
          report: { error: error.message }
        });
      }finally {
        setTimeout(async () => {
        try {
          await fs.rm(workDir, { recursive: true, force: true });
          console.log(`Cleaned up ${workDir}`);
        } catch (err) {
          console.error("Cleanup failed:", err.message);
        }
      }, 1000);
    }
  }

  addToQueue(dbId, scanTask);

  const report = {
    success: true,
    dbId,
    scanId,
    clientName,
    repoUrl,
  };
  res.status(202).json(report);
};

module.exports =  { runSastScan };
