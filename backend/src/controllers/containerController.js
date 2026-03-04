import path from "path";
import fs from "fs/promises";
import { promisify } from "util";
import { exec } from "child_process";
import VulReport from "../model/schema.js";
import mongoose from "mongoose";
import { addToQueue } from "./queue.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runContainerScan(req, res) {
  const { clientName, imageName } = req.body;

  if (!imageName) {
    return res.status(400).json({ error: 'Image name (e.g., "alpine:latest") is required' });
  }

  const scanId = Date.now().toString();
  const dbId = new mongoose.Types.ObjectId();

  await VulReport.create({
        _id: dbId,
        client_name: clientName,
        scan_id: scanId,
        scan_type: 'Container',
        scan_status: 'pending',
        report: null,
  });

  const scanTask = async() => {
    try {
      const workDir = path.resolve(__dirname, "..", "scans", `trivy-${scanId}`);
      const reportsDir = path.join(workDir, 'reports');
      const reportFile = 'trivy-report.json';
      const reportPath = path.join(reportsDir, reportFile);
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

      await VulReport.findByIdAndUpdate(dbId, {
        scan_status: 'completed',
        finished_at: new Date(),
        report: jsonReport,
      });

      console.log('Container scan report saved successfully');

    } catch (error) {
      console.error('Trivy Scan error:', error);
      res.status(500).json({ 
        error: 'Container scan failed', 
        details: error.message 
      });
    }
    finally {
      setTimeout(async () => {
        try {
          await fs.rm(workDir, { recursive: true, force: true });
          console.log(`Cleaned up ${workDir}`);
        } catch (err) {
          console.error("Cleanup failed:", err.message);
        }
      }, 1000);
    }
  };

addToQueue(dbId, scanTask);

  res.status(202).json({
      success: true,
      dbId,
      scanId,
      image: imageName,
      clientName,
  });

};

export { runContainerScan };