import path from "path";
import fs from "fs/promises";
import cors from "cors";
import { runZapScan } from "../services/zapService.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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



export { runDastScan };

