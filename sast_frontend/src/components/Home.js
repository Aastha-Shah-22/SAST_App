import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const page = {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "system-ui, sans-serif",
  };

  const hero = {
    textAlign: "center",
    maxWidth: "520px",
    marginBottom: "40px",
  };

  const title = {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "12px",
  };

  const subtitle = {
    fontSize: "0.95rem",
    color: "#9ca3af",
    lineHeight: "1.5",
  };

  const cards = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    maxWidth: "700px",
    width: "100%",
  };

  const card = {
    backgroundColor: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "20px",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const iconBox = (bg, color) => ({
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    backgroundColor: bg,
    color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const cardTitle = {
    fontSize: "1rem",
    fontWeight: "600",
    marginTop: "6px",
  };

  const cardText = {
    fontSize: "0.85rem",
    color: "#9ca3af",
    lineHeight: "1.5",
  };

  const cta = {
    marginTop: "auto",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#38bdf8",
  };

  return (
    <div style={page}>
      {/* Hero */}
      <header style={hero}>
        <h1 style={title}>
          Scan. <span style={{ color: "#38bdf8" }}>Detect.</span> Defend.
        </h1>
        <p style={subtitle}>
          Production-grade static analysis & container vulnerability scanning
          powered by Semgrep & Trivy.
        </p>
      </header>

      <section style={cards}>
        {/* SAST */}
        <Link to="/Sast" style={card}>
          <div style={iconBox("rgba(56,189,248,0.15)", "#38bdf8")}>
            {"</>"}
          </div>
          <h2 style={cardTitle}>SAST Scan</h2>
          <p style={cardText}>
            Clone a Git repository and detect code-level vulnerabilities before
            deployment.
          </p>
          <span style={cta}>Start SAST Scan →</span>
        </Link>

        {/* Container */}
        <Link to="/Trivvy" style={card}>
          <div style={iconBox("rgba(251,146,60,0.15)", "#fb923c")}>
          </div>
          <h2 style={cardTitle}>Container Scan</h2>
          <p style={cardText}>
            Scan Docker images for vulnerabilities and misconfigurations using
            Trivy.
          </p>
          <span style={cta}>Start Container Scan →</span>
        </Link>
      </section>
    </div>
  );
}

export default Home;
