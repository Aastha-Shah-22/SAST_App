import React, { useState } from "react";
import { runSASTScan } from "../services/scanapi";

function SASTPage() {
  const [form, setForm] = useState({
    repoUrl: "",
    gitUsername: "",
    gitToken: "",
    semgrepToken: "",
    branch: "main",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data } = await runSASTScan(
        form.repoUrl,
        form.gitUsername,
        form.gitToken,
        form.semgrepToken,
        form.branch
      );
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
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
    color: "#e5e7eb",
    fontFamily: "system-ui, sans-serif",
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
        <h1>SAST <span style={{ color: "#38bdf8" }}>Scan</span></h1>
        <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          Static Application Security Testing via Semgrep
        </p>
      </header>

      {/* Form */}
      <div style={box}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          <div>
            <div style={label}>Repository URL *</div>
            <input
              style={input}
              placeholder="https://github.com/user/repo.git"
              value={form.repoUrl}
              onChange={handleChange("repoUrl")}
              required
            />
          </div>

          <div>
            <div style={label}>Branch</div>
            <input
              style={input}
              placeholder="main"
              value={form.branch}
              onChange={handleChange("branch")}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <div style={label}>Git Username</div>
              <input
                style={input}
                value={form.gitUsername}
                onChange={handleChange("gitUsername")}
              />
            </div>

            <div>
              <div style={label}>Git Token</div>
              <input
                style={input}
                type="password"
                value={form.gitToken}
                onChange={handleChange("gitToken")}
              />
            </div>
          </div>

          <div>
            <div style={label}>Semgrep Token *</div>
            <input
              style={input}
              type="password"
              value={form.semgrepToken}
              onChange={handleChange("semgrepToken")}
              required
            />
          </div>

          <button type="submit" style={button} disabled={loading}>
            {loading ? "Scanning…" : "Run SAST Scan"}
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

            <p>Findings: {result.summary.totalFindings}</p>
            <p>Errors: {result.summary.errors}</p>
            <p>Paths Scanned: {result.summary.pathsScanned}</p>

            <button
            style={{
                marginTop: "12px",
                padding: "8px 12px",
                background: "#1e293b",
                color: "#38bdf8",
                border: "1px solid #38bdf8",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.85rem",
            }}
            onClick={() => setShowJson((prev) => !prev)}
            >
            {showJson ? "Hide JSON Report" : "Show JSON Report"}
            </button>

            {/* JSON Viewer */}
            {showJson && (
            <pre
                style={{
                marginTop: "14px",
                padding: "14px",
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                fontSize: "0.75rem",
                color: "#e5e7eb",
                overflowX: "auto",
                maxHeight: "400px",
                }}
            >
                {JSON.stringify(result.jsonReport, null, 2)}
            </pre>
            )}
        </div>
    )}

    </div>
  );
}

export default SASTPage;
