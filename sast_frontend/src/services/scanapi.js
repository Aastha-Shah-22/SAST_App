import axios from "axios";

const BASE_URL =
   "http://localhost:3001";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const runSASTScan = (
  repoUrl,
  gitUsername,
  gitToken,
  semgrepToken,
  branch = "main"
) =>
  api.post("/api/scan/sast", {
    repoUrl,
    gitUsername,
    gitToken,
    semgrepToken,
    branch,
  });

export const runContainerScan = (imageName) =>
  api.post("/api/scan/container", { imageName });

export default api;