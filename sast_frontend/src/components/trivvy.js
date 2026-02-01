import React, { useState } from "react";
import { runContainerScan } from "../services/scanapi";
import SeverityBadge from "./SeverityBadge";

function ContainerPage() {
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleGroup = (idx) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setExpanded({});

    try {
      const { data } = await runContainerScan(imageName.trim());
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.details || err.message || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STYLES ---------------- */

  const page = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px 60px",
    fontFamily: "system-ui, sans-serif",
    color: "#e5e7eb",
  };

  const box = {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "20px",
  };

  const label = {
    fontSize: "0.8rem",
    color: "#9ca3af",
    marginBottom: "4px",
  };

  const input = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    background: "#0f172a",
    color: "#e5e7eb",
    width: "100%",
  };

  const button = {
    marginTop: "12px",
    padding: "10px",
    background: "#38bdf8",
    color: "#020617",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  };

  /* ---------------------------------------- */

    const [showJson, setShowJson] = useState(false);

  return (
    <div style={page}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1>
          Container <span style={{ color: "#38bdf8" }}>Scan</span>
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          Vulnerability & misconfiguration scanning via Trivy
        </p>
      </header>

      {/* Form */}
      <div style={box}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div>
            <div style={label}>Image Name *</div>
            <input
              style={input}
              placeholder="alpine:latest"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={button} disabled={loading}>
            {loading ? "Scanning…" : "Run Container Scan"}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...box, marginTop: "20px", borderColor: "#ef4444" }}>
          <strong style={{ color: "#ef4444" }}>Scan Failed</strong>
          <p style={{ fontSize: "0.85rem" }}>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ ...box, marginTop: "20px" }}>
            <h3>Scan Results</h3>
        <button
            onClick={() => setShowJson(!showJson)}
            style={{
                marginTop: "12px",
                padding: "8px 12px",
                background: "#1e293b",
                color: "#38bdf8",
                border: "1px solid #38bdf8",
                borderRadius: "6px",
                cursor: "pointer",
            }}
            >
            {showJson ? "Hide JSON Report" : "Show JSON Report"}
            </button>

            {showJson && (
            <pre
                style={{
                marginTop: "12px",
                padding: "14px",
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                fontSize: "0.8rem",
                overflowX: "auto",
                maxHeight: "500px",
                }}
            >
                {JSON.stringify(result, null, 2)}
            </pre>
            )}
        </div>
        )}

    </div>
  );
}

export default ContainerPage;