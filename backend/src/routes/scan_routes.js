import express from "express";
import { runDastScan } from "../controllers/dastController.js";
import { runSastScan } from "../controllers/sastController.js";
import { runContainerScan } from "../controllers/containerController.js";
import { runAppScan } from "../controllers/appController.js";

const router = express.Router();

router.post("/scan/dast", runDastScan);

router.post("/scan/dast/:scanId/stop",cancelDastScan);

router.post("/scan/sast", runSastScan);

router.post("/scan/container", runContainerScan);

router.post("/scan/app", runAppScan);

export default router;