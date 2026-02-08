const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");

const { runZapScan } = require("../services/zapService");
async function runDastScan(req, res) {
  const { url, quickScan } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "Target URL is required" });
  }

  const scanId = Date.now().toString();
  const dastResultsDir = path.resolve(__dirname, "..", "scans", "dast_results");

  try {
    await fs.mkdir(dastResultsDir, { recursive: true });

    console.log(
      `Starting ZAP scan for ${url}${quickScan ? " (quick scan)" : ""}`
    );

    const findings = await runZapScan(url, { quickScan: !!quickScan });

    const report = {
      success: true,
      scanId,
      target: url,
      totalFindings: findings.length,
      findings
    };

    const reportFileName = `zap-report-${scanId}.json`;
    const reportPath = path.join(dastResultsDir, reportFileName);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`[DAST] Report saved to ${reportPath}`);

    return res.json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "ZAP scan failed",
      details: err.message
    });
  }
}

module.exports = {
  runDastScan,
};

