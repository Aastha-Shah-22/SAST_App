const express = require("express");
const { runDastScan } = require("../controllers/dastController");
const { runSastScan } = require("../controllers/sastController");
const { runContainerScan } = require("../controllers/containerController");
const { runAppScan } = require("../controllers/appController");

const router = express.Router();

// Dynamic Application Security Testing (DAST) scans
router.post("/scan/dast", runDastScan);

router.post("/scan/sast", runSastScan);

router.post("/scan/container", runContainerScan);

router.post("/scan/app", runAppScan);

module.exports = router;