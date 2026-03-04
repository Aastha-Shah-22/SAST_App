import path from "path";
import fs from "fs/promises";
import { promisify } from "util";
import { exec } from "child_process";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runAppScan(req, res) {
  const apkPath = req?.file?.path;
  const originalName = req?.file?.originalname || 'app.apk';

  if (!apkPath) {
    return res.status(400).json({ error: 'APK file is required' });
  }

  const scanId = Date.now().toString();
  const workDir = path.resolve(__dirname, "..", "scans", `mobsf-${scanId}`);
  const reportsDir = path.join(workDir, 'reports');
  const reportFile = 'mobsf-report.json';
  const reportPath = path.join(reportsDir, reportFile);

  try {
    await fs.mkdir(reportsDir, { recursive: true });

    await execPromise('docker pull opensecurity/mobile-security-framework-mobsf:latest');

    const dockerCmd = `docker run --rm \
      -v "${apkPath}:/app/${originalName}" \
      -v "${reportsDir}:/reports" \
      opensecurity/mobile-security-framework-mobsf:latest \
      /bin/bash -lc "python3 manage.py scan_app -f /app/${originalName} -o /reports/${reportFile}"`;

    await execPromise(dockerCmd, { timeout: 600000, maxBuffer: 1024 * 1024 * 20 });

    const jsonContent = await fs.readFile(reportPath, 'utf-8');
    const jsonReport = JSON.parse(jsonContent);

    return res.json({
      success: true,
      scanId,
      file: originalName,
      summary: {
        findings: jsonReport?.findings ? Object.keys(jsonReport.findings).length : 0,
        warnings: jsonReport?.warnings ? Object.keys(jsonReport.warnings).length : 0
      },
      report: jsonReport
    });
  } catch (error) {
    console.error('MobSF Scan error:', error);
    return res.status(500).json({
      error: 'App scan failed',
      details: error.message
    });
  } finally {
    // await fs.rm(workDir, { recursive: true, force: true });
  }
}

export { runAppScan };