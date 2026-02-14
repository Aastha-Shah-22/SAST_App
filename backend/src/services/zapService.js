const path = require("path");
const fs = require("fs").promises;
const util = require("util");
const { exec } = require("child_process");
const execPromise = util.promisify(exec);

const ZAP_IMAGE = process.env.ZAP_DOCKER_IMAGE || "ghcr.io/zaproxy/zaproxy:stable";
const ZAP_SCAN_TIMEOUT = 600000;

function extractAlertsFromReport(jsonReport) {
  if (!jsonReport) return [];
  if (Array.isArray(jsonReport.alerts)) return jsonReport.alerts;
  if (Array.isArray(jsonReport.site)) {
    const alerts = [];
    for (const site of jsonReport.site) {
      if (Array.isArray(site.alerts)) {
        alerts.push(...site.alerts);
      }
    }
    return alerts;
  }
  return [];
}

async function runZapScan(targetUrl, reportDir) {
  console.log(`[ZAP] Target: ${targetUrl} | Mode: Docker full scan (zap-full-scan.py)`);

  await fs.mkdir(reportDir, { recursive: true });

  console.log(`[ZAP] Ensuring ZAP image is available: ${ZAP_IMAGE}`);
  try {
    await execPromise(`docker pull ${ZAP_IMAGE}`, {
      timeout: 300000, // 5 min for pull
      maxBuffer: 1024 * 1024 * 5,
    });
  } catch (pullErr) {
    throw new Error(
      `Failed to pull ZAP Docker image. Ensure Docker is running and you have network access. Image: ${ZAP_IMAGE}. Error: ${pullErr.message}`
    );
  }
  console.log("[ZAP] Image ready, starting full scan...");

  const reportFileName = "zap-raw-report.json";
  const containerReportPath = "/zap/wrk/" + reportFileName;

  const normalizedDir = path.resolve(reportDir);
  const dockerCmd = `docker run --rm -v "${normalizedDir}:/zap/wrk:rw" ${ZAP_IMAGE} zap-full-scan.py -t "${targetUrl}" -J ${containerReportPath} -I`;

  let scanExitCode = 0;
  try {
    await execPromise(dockerCmd, {
      timeout: ZAP_SCAN_TIMEOUT,
      maxBuffer: 1024 * 1024 * 20,
    });
  } catch (execErr) {
    scanExitCode = execErr.code ?? -1;
    if (scanExitCode === 1 || scanExitCode === 2) {
      console.log(`[ZAP] Scan completed with findings (exit code ${scanExitCode})`);
    } else {
      throw new Error(
        `ZAP scan failed. Ensure Docker is running. Error: ${execErr.message}`
      );
    }
  }

  const reportPath = path.join(normalizedDir, reportFileName);
  let jsonReport;
  try {
    await fs.access(reportPath);
    const content = await fs.readFile(reportPath, "utf-8");
    jsonReport = JSON.parse(content);
  } catch (readErr) {
    throw new Error(
      `ZAP scan ran but report file was not found or invalid. Path: ${reportPath}. Error: ${readErr.message}`
    );
  }

  const alerts = extractAlertsFromReport(jsonReport);
  const count = alerts.length;
  console.log(`[ZAP] Done. Alerts: ${count}`);
  return alerts;
}

module.exports = { runZapScan };
