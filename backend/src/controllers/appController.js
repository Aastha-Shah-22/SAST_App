
const path = require("path");
const crypto = require("crypto");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function runAppScan(req, res) {

  console.log('Received scan request for file:', req?.file?.path);

  if (!req.file?.path) {
    return res.status(400).json({ error: 'APK file is required' });
  }

  let containerId = null;
  const mobsfApiKey = process.env.MOBSF_API_KEY || `mobsf-${crypto.randomBytes(8).toString('hex')}`;
  const uploadFilePath = path.resolve(req.file.path);
  const safeName = (req.file.originalname || 'app.apk').replace(/[^a-zA-Z0-9_.-]/g, '_');
  const containerApkPath = `/tmp/${Date.now()}-${safeName}`;

  const waitForMobSF = async () => {
    const deadline = Date.now() + 180000;
    while (Date.now() < deadline) {
      try {
        const { stdout } = await execPromise(
          `docker exec ${containerId} /bin/bash -lc "curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/"`
        );
        if ((stdout || '').trim()) {
          console.log('[MobSF] Ready');
          return;
        }
      } catch (err) {
        // Retry after delay
      }
      await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error('MobSF did not become ready in time.');
  };

  const execJson = async (cmd) => {
    const { stdout } = await execPromise(cmd, { maxBuffer: 1024 * 1024 * 20 });
    const payload = (stdout || '').trim();
    if (!payload) throw new Error('Empty response from MobSF.');
    try {
      return JSON.parse(payload);
    } catch (err) {
      throw new Error(`Invalid JSON from MobSF: ${payload}`);
    }
  };


  try {
    // 0. Start MobSF Docker container
    console.log('[MobSF] Starting Docker container');
    const { stdout: dockerOut } = await execPromise(
      `docker run -d -e MOBSF_API_KEY=${mobsfApiKey} opensecurity/mobile-security-framework-mobsf:latest`
    );
    containerId = dockerOut.trim();
    console.log(`[MobSF] Container started: ${containerId}`);

    // Wait for MobSF to be ready
    await waitForMobSF();

    console.log('[MobSF] Copying APK into container');
    await execPromise(`docker cp "${uploadFilePath}" ${containerId}:${containerApkPath}`);

    console.log('[MobSF] Uploading APK');
    const uploadJson = await execJson(
      `docker exec ${containerId} /bin/bash -lc "curl -s -X POST http://localhost:8000/api/v1/upload -H 'Authorization: ${mobsfApiKey}' -F 'file=@${containerApkPath}'"`
    );

    const { hash } = uploadJson;
    if (!hash) throw new Error('Failed to upload APK to MobSF');

    // 2. Scan the APK
    console.log('[MobSF] Starting scan');
    const scanJson = await execJson(
      `docker exec ${containerId} /bin/bash -lc "curl -s -X POST http://localhost:8000/api/v1/scan -H 'Authorization: ${mobsfApiKey}' -H 'Content-Type: application/json' -d '{\\\"hash\\\":\\\"${hash}\\\",\\\"scan_type\\\":\\\"apk\\\"}'"`
    );

    // 3. Get the scan report
    console.log('[MobSF] Fetching report');
    const reportJson = await execJson(
      `docker exec ${containerId} /bin/bash -lc "curl -s -X POST http://localhost:8000/api/v1/report_json -H 'Authorization: ${mobsfApiKey}' -H 'Content-Type: application/json' -d '{\\\"hash\\\":\\\"${hash}\\\"}'"`
    );

    console.log('[MobSF] Scan complete');
    return res.json({
      success: true,
      file: req.file.originalname,
      scan: scanJson,
      report: reportJson
    });
  } catch (error) {
    console.error('MobSF Scan error:', error);
    return res.status(500).json({
      error: 'App scan failed',
      details: error.message
    });
  } finally {
    // 4. Stop and remove MobSF Docker container
    if (containerId) {
      try {
        console.log('[MobSF] Removing container');
        await execPromise(`docker rm -f ${containerId}`);
      } catch (e) {
        console.error('Failed to remove MobSF container:', e);
      }
    }
  }
}

module.exports = {
  runAppScan
};
