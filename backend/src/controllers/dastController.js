const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const mongoose = require("mongoose");
const VulReport = require("../model/schema.js");

const { runZapScan } = require("../services/zapService");
async function runDastScan(req, res) {
  const { url, clientName } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "Target URL is required" });
  }

  const scanId = Date.now().toString();
  const dbId = new mongoose.Types.ObjectId();
  const dastResultsDir = path.resolve(__dirname, "..", "scans", "dast_results");

  try {
    await VulReport.create({
      _id: dbId,
      client_name: clientName,
      scan_id: scanId,
      scan_type: "DAST",
      scan_remediated_status: "in_progress",
      scan_status: "pending",
      report: null,
    });

    await fs.mkdir(dastResultsDir, { recursive: true });

    console.log(`Starting ZAP scan for ${url}`);

    const findings = await runZapScan(url);

    const report = {
      success: true,
      dbId,
      scanId,
      target: url,
      totalFindings: findings.length,
      findings,
    };

    const reportFileName = `zap-report-${scanId}.json`;
    const reportPath = path.join(dastResultsDir, reportFileName);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`[DAST] Report saved to ${reportPath}`);

    await VulReport.findByIdAndUpdate(dbId, {
      scan_status: "completed",
      finished_at: new Date(),
      report,
    });

    return res.json(report);
  } catch (err) {
    console.error(err);

    try {
      await VulReport.findByIdAndUpdate(dbId, {
        scan_status: "failed",
        report: { error: err.message },
        finished_at: new Date(),
      });
    } catch (dbErr) {
      console.error("Failed to update DAST scan status in DB:", dbErr);
    }

    return res.status(500).json({
      error: "ZAP scan failed",
      details: err.message,
    });
  }
}

module.exports = {
  runDastScan,
};

