const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

interface SastScanPayload {
  repoUrl: string;
  gitUsername: string;
  gitToken: string;
  semgrepToken: string;
  branch: string;
}

interface DastScanPayload {
  url: string;
  quickScan: boolean;
}

interface ContainerScanPayload {
  imageName: string;
}

interface AppScanPayload {
  apkPath: string;
  originalName?: string;
}

export const startSastScan = async (payload: SastScanPayload) => {
  const res = await fetch(`${API_BASE_URL}/scan/sast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    console.log("Cannot start SAST scan", await res.text());
    throw new Error("Failed to start SAST scan");
  }

  return res.json();
};

export const startDastScan = async (payload: DastScanPayload) => {
  const res = await fetch(`${API_BASE_URL}/scan/dast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    throw new Error("Failed to start DAST scan");
  }

  return res.json();
};

export const startContainerScan = async (payload: ContainerScanPayload) => {
  const res = await fetch(`${API_BASE_URL}/scan/container`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    throw new Error("Failed to start Container scan");
  }

  return res.json();
};

export const startAppScan = async (payload?: AppScanPayload) => {
  const res = await fetch(`${API_BASE_URL}/scan/app`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    throw new Error("Failed to start App scan");
  }

  return res.json();
};
