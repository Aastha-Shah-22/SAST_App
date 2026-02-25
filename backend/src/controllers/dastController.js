const path = require("path");
const fs = require("fs").promises;
const mongoose = require("mongoose");

const VulReport = require("../model/schema");

const {
  runZapScan,
  stopZapScan
} = require("../services/zapService");


async function runDastScan(req, res) {
  const { url, clientName } = req.body;

  if (!url) {
    return res.status(400).json({
      error: "url required"
    });
  }

  const scanId = Date.now().toString();

  const dbId = new mongoose.Types.ObjectId();

  const dir = path.resolve(
    __dirname,
    "..",
    "scans",
    "dast_results",
    `scan-${scanId}`
  );

  await fs.mkdir(dir, {
    recursive: true
  });

  await VulReport.create({
    _id: dbId,
    scan_id: scanId,
    client_name: clientName,
    scan_status: "running",
    scan_type: "DAST"
  });

  await runZapScan(
    url,
    dir,
    scanId
  );

  res.json({
    success: true,
    scanId
  });
}



async function cancelDastScan(req, res) {
  const { scanId } = req.params;

  try {
    await stopZapScan(scanId);

    await VulReport.updateOne(
      { scan_id: scanId },
      {
        scan_status: "cancelled"
      }
    );

    res.json({
      success: true
    });
  }
  catch (e) {
    res.status(400).json({
      error: e.message
    });
  }
}



module.exports = {
  runDastScan,
  cancelDastScan
};