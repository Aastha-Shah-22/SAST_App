const axios = require("axios");

// ZAP configuration
const ZAP_BASE = process.env.ZAP_BASE_URL || "http://localhost:8080";
const ZAP_API_KEY = process.env.ZAP_API_KEY || "";
const POLL_INTERVAL = 2000; // 2 sec so progress logs are frequent

const sleep = ms => new Promise(r => setTimeout(r, ms));

function zapParams(params) {
  const p = { ...params };
  if (ZAP_API_KEY) p.apikey = ZAP_API_KEY;
  return p;
}

function wrapZapError(err, context) {
  if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
    throw new Error(
      `ZAP is not reachable at ${ZAP_BASE}. Start ZAP in Docker first. Original: ${err.message}`
    );
  }
  const msg = err.response?.data?.message || err.message;
  throw new Error(`${context}: ${msg}`);
}

async function runZapScan(targetUrl) {
  console.log(`[ZAP] Target: ${targetUrl} | Mode: full scan`);

  // 1. Spider
  let spiderRes;
  try {
    spiderRes = await axios.get(
      `${ZAP_BASE}/JSON/spider/action/scan/`,
      { params: zapParams({ url: targetUrl, recurse: true }) }
    );
  } catch (err) {
    wrapZapError(err, "Spider start failed");
  }

  const spiderId = spiderRes.data.scan;
  if (spiderId == null) {
    throw new Error("Spider did not start. Check target URL and ZAP logs.");
  }

  console.log("[ZAP] Spider started, polling progress...");
  let spiderProgress = 0;
  while (spiderProgress < 100) {
    await sleep(POLL_INTERVAL);
    try {
      const statusRes = await axios.get(
        `${ZAP_BASE}/JSON/spider/view/status/`,
        { params: zapParams({ scanId: spiderId }) }
      );
      spiderProgress = Number(statusRes.data.status) || 0;
      if (spiderProgress < 100) {
        console.log(`[ZAP] Spider: ${spiderProgress}%`);
      }
    } catch (err) {
      wrapZapError(err, "Spider status failed");
    }
  }
  console.log("[ZAP] Spider phase done (100%).");


  let ascanRes;
  try {
    ascanRes = await axios.get(
      `${ZAP_BASE}/JSON/ascan/action/scan/`,
      { params: zapParams({ url: targetUrl, recurse: true }) }
    );
  } catch (err) {
    wrapZapError(err, "Active scan start failed");
  }

  const ascanId = ascanRes.data.scan;
  if (ascanId == null) {
    throw new Error("Active scan did not start. Check target URL and ZAP logs.");
  }

  console.log("[ZAP] Active scan started, polling progress...");
  let ascanProgress = 0;
  while (ascanProgress < 100) {
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
  console.log("[ZAP] Active scan phase done (100%).");

  // 4. Fetch results
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

module.exports = { runZapScan };

