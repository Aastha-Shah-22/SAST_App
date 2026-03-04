const path = require("path");
const fs = require("fs").promises;
const Docker = require("dockerode");

const docker = new Docker();

const ZAP_IMAGE =
  process.env.ZAP_DOCKER_IMAGE || "ghcr.io/zaproxy/zaproxy:stable";

const activeScans = new Map();
/*
scanId -> {
   containerId,
   status
}
*/

async function ensureImage() {
  try {
    await docker.getImage(ZAP_IMAGE).inspect();
  } catch {
    console.log("[ZAP] Pulling image...");
    const stream = await docker.pull(ZAP_IMAGE);

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, err =>
        err ? reject(err) : resolve()
      );
    });

    console.log("[ZAP] Image pulled");
  }
import axios from "axios";

// ZAP configuration and timeouts
const ZAP_BASE = process.env.ZAP_BASE_URL || "http://localhost:8080";
const ZAP_API_KEY = process.env.ZAP_API_KEY || "";
const POLL_INTERVAL = 2000; // 2 sec so progress logs are frequent
// Full scan: runs to 100% with optional safety cap. Set ZAP_FULL_SCAN_PHASE_MS (0 = no cap, default 600000 = 10 min).
const POLL_TIMEOUT_MS =
  process.env.ZAP_FULL_SCAN_PHASE_MS === undefined ||
  process.env.ZAP_FULL_SCAN_PHASE_MS === ""
    ? 600000
    : Number(process.env.ZAP_FULL_SCAN_PHASE_MS);
// Quick scan: prototype only; stops after N sec per phase. Not for production (see docs/PRODUCTION.md).
const QUICK_SCAN_PHASE_MS = 30000; // 30 sec per phase

const sleep = ms => new Promise(r => setTimeout(r, ms));

function zapParams(params) {
  const p = { ...params };
  if (ZAP_API_KEY) p.apikey = ZAP_API_KEY;
  return p;
}

function extractAlerts(json) {
  if (!json) return [];

  if (Array.isArray(json.alerts))
    return json.alerts;

  if (Array.isArray(json.site)) {
    return json.site.flatMap(s => s.alerts || []);
  }

  return [];
}

async function runZapScan(targetUrl, reportDir, scanId) {

  console.log("[ZAP] preparing scan", scanId);

  await fs.mkdir(reportDir, { recursive: true });

  await ensureImage();

  const reportName = "zap-raw-report.json";

  const container = await docker.createContainer({

    Image: ZAP_IMAGE,

    Cmd: [
      "zap-full-scan.py",
      "-t",
      targetUrl,
      "-J",
      `/zap/wrk/${reportName}`,
      "-I"
    ],

    HostConfig: {
      Binds: [`${path.resolve(reportDir)}:/zap/wrk`],
    }

  });

  const containerId = container.id;

  console.log("[ZAP] container created", containerId);

  activeScans.set(scanId, {
    containerId,
    status: "running"
  });

  console.log("[ZAP] activeScans =", activeScans);

  await container.start();

  console.log("[ZAP] scan started", scanId);

  /*
  run in background
  */
  container.wait().then(async () => {

    console.log("[ZAP] scan finished", scanId);

    try {

      const reportPath =
        path.join(reportDir, reportName);

      const content =
        await fs.readFile(reportPath, "utf8");

      const alerts =
        extractAlerts(JSON.parse(content));

      console.log(
        "[ZAP] alerts:",
        alerts.length
      );

    } catch {}

    try {
      await container.remove({ force: true });
    } catch {}

    activeScans.delete(scanId);

    console.log("[ZAP] removed from activeScans");

  });

  return containerId;
}


async function stopZapScan(scanId) {

  console.log("STOP requested:", scanId);
  console.log("activeScans now:", activeScans);

  const scan = activeScans.get(scanId);

  if (!scan)
    throw new Error(
      "Scan not running"
    );

  const container =
    docker.getContainer(scan.containerId);

  try {
    await container.stop({ t: 0 });
  } catch {}

  try {
    await container.remove({ force: true });
  } catch {}

  activeScans.delete(scanId);

  console.log("STOP successful");

}


module.exports = {
  runZapScan,
  stopZapScan
};
        "[ZAP] Active scan phase time limit reached, fetching results."
      );
      break;
    }
    await sleep(POLL_INTERVAL);
    try {
      const statusRes = await axios.get(
        `${ZAP_BASE}/JSON/ascan/view/status/`,
        { params: zapParams({ scanId: ascanId }) }
      );
      ascanProgress = Number(statusRes.data.status) || 0;
      if (ascanProgress < 100) {
        console.log(`[ZAP] Active scan: ${ascanProgress}%`);
      }
    } catch (err) {
      wrapZapError(err, "Active scan status failed");
    }
  }
  console.log("[ZAP] Active scan phase done (100% or time limit).");

  // 3. Fetch results
  console.log("[ZAP] Fetching report...");
  let alertsRes;
  try {
    alertsRes = await axios.get(
      `${ZAP_BASE}/JSON/core/view/alerts/`,
      { params: zapParams({ baseurl: targetUrl }) }
    );
  } catch (err) {
    wrapZapError(err, "Fetch alerts failed");
  }

  const alerts = alertsRes.data?.alerts;
  const count = Array.isArray(alerts) ? alerts.length : 0;
  console.log(`[ZAP] Done. Alerts: ${count}`);
  return Array.isArray(alerts) ? alerts : [];
}

export { runZapScan };

