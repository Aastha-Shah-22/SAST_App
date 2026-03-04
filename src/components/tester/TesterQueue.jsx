import React, { useState, useEffect } from "react";

// Use Tailwind utilities directly within className

const ScanQueueDashboard = () => {
  // State for optional toast notification (from your original snippet)
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (title, message) => {
    setToastMessage({ title, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="bg-[#0f1115] min-h-screen text-gray-300 font-sans flex flex-col items-center">
      {/* Container to restrict width and align elements */}
      <div className="w-full max-w-7xl px-4 py-8 relative">
        {/* Simple Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 right-4 bg-[#1a1e24] border border-gray-700 text-white p-4 rounded shadow-2xl z-50 animate-bounce transition-all duration-300">
            <h4 className="font-bold text-sm text-cyan-400">
              {toastMessage.title}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {toastMessage.message}
            </p>
          </div>
        )}

        {/* 1. Header Section */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
          <div>
            <h2
              className="text-4xl font-extrabold tracking-widest text-white mb-1 uppercase"
              style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
            >
              Scan Queue
            </h2>
            <div className="text-gray-500 text-sm font-mono tracking-wide">
              7 assets awaiting processing
            </div>
          </div>
          {/* Docker Status Badge - Styled to look technical */}
          <div className="bg-[#111827] border border-[#1e3a8a] text-blue-400 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded flex items-center gap-2 font-mono shadow-[0_0_10px_rgba(30,58,138,0.2)]">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Docker: 2 containers active
          </div>
        </div>

        {/* 2. Stats Row Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {/* Stat Card: Queued */}
          <div className="bg-[#13161b] rounded border border-gray-800 border-b-[3px] border-b-cyan-500 p-5 flex flex-col justify-between hover:bg-[#181c22] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">🌐</div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 font-mono">
              Queued
            </div>
            <div
              className="text-6xl font-extrabold text-cyan-400 italic"
              style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
            >
              7
            </div>
            <div className="text-xs text-gray-500 mt-2 font-mono">
              Awaiting scan
            </div>
          </div>

          {/* Stat Card: In Progress */}
          <div className="bg-[#13161b] rounded border border-gray-800 border-b-[3px] border-b-purple-500 p-5 flex flex-col justify-between hover:bg-[#181c22] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">⚡</div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 font-mono">
              In Progress
            </div>
            <div
              className="text-6xl font-extrabold text-purple-400 italic"
              style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
            >
              2
            </div>
            <div className="text-xs text-gray-500 mt-2 font-mono">
              Docker running
            </div>
          </div>

          {/* Stat Card: Pending Review */}
          <div className="bg-[#13161b] rounded border border-gray-800 border-b-[3px] border-b-yellow-500 p-5 flex flex-col justify-between hover:bg-[#181c22] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">⚠️</div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 font-mono">
              Pending Review
            </div>
            <div
              className="text-6xl font-extrabold text-yellow-500 italic"
              style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
            >
              5
            </div>
            <div className="text-xs text-gray-500 mt-2 font-mono">
              Manual review needed
            </div>
          </div>

          {/* Stat Card: Completed Today */}
          <div className="bg-[#13161b] rounded border border-gray-800 border-b-[3px] border-b-emerald-400 p-5 flex flex-col justify-between hover:bg-[#181c22] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">✓</div>
            <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 font-mono">
              Completed Today
            </div>
            <div
              className="text-6xl font-extrabold text-emerald-400 italic"
              style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
            >
              3
            </div>
            <div className="text-xs text-gray-500 mt-2 font-mono">
              Reports generated
            </div>
          </div>
        </div>

        {/* 3. Asset Queue Panel */}
        <div className="bg-[#121419] rounded-lg border border-gray-800 shadow-2xl">
          {/* Panel Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800/80 bg-[#14171d] rounded-t-lg">
            <span className="font-bold text-white tracking-wide text-sm">
              Asset Queue
            </span>
            <span className="bg-[#1a1e24] text-[10px] px-2.5 py-1 rounded text-gray-400 border border-gray-700/50 font-mono">
              OpenVAS + MobSF
            </span>
          </div>

          {/* Queue List */}
          <div className="p-2">
            {/* --- Queue Item 1: Queued Web --- */}
            <div className="flex items-center justify-between py-4 px-4 border-b border-gray-800/40 last:border-0 hover:bg-[#161a20] transition-colors rounded-md group">
              {/* Left side: Icon & Info */}
              <div className="flex items-center gap-4 w-[60%]">
                <div className="w-10 h-10 rounded-md bg-[#1a1e24] border border-gray-700/50 flex items-center justify-center shrink-0 shadow-inner">
                  {/* Substitute icon for typical web globe */}
                  <span className="text-cyan-400 text-lg">🌐</span>
                </div>
                <div className="overflow-hidden">
                  <div className="text-white font-semibold text-sm truncate group-hover:text-cyan-300 transition-colors">
                    https://staging.acme.io
                  </div>
                  <div className="text-[11px] text-gray-500 truncate mt-1 font-mono uppercase tracking-wider">
                    WEB · Submitted by Acme Corp · Feb 25, 2026
                  </div>
                </div>
              </div>

              {/* Right side: Status & Action */}
              <div className="flex items-center justify-between w-[40%] pl-8">
                {/* Status Badge */}
                <div className="flex-1 flex justify-center">
                  <span className="bg-[#1e232b] text-gray-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm flex items-center gap-1.5 border border-gray-700/60 font-mono tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                    QUEUED
                  </span>
                </div>
                {/* Action Button */}
                <div className="flex-shrink-0 w-32 flex justify-end">
                  <button
                    onClick={() =>
                      showToast(
                        "Scan Initiated",
                        "Docker container launching for staging.acme.io"
                      )
                    }
                    className="bg-purple-900/30 hover:bg-purple-800/50 border border-purple-700/50 text-purple-300 text-[11px] px-4 py-1.5 rounded transition-all flex items-center gap-1.5 font-bold tracking-wide shadow-[0_0_10px_rgba(147,51,234,0.1)] hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] uppercase"
                  >
                    ▶ Start Scan
                  </button>
                </div>
              </div>
            </div>

            {/* --- Queue Item 2: Queued Mobile --- */}
            <div className="flex items-center justify-between py-4 px-4 border-b border-gray-800/40 last:border-0 hover:bg-[#161a20] transition-colors rounded-md group">
              <div className="flex items-center gap-4 w-[60%]">
                <div className="w-10 h-10 rounded-md bg-[#1a1e24] border border-gray-700/50 flex items-center justify-center shrink-0 shadow-inner">
                  <span className="text-purple-400 text-lg">📱</span>
                </div>
                <div className="overflow-hidden">
                  <div className="text-white font-semibold text-sm truncate group-hover:text-purple-300 transition-colors">
                    FinanceApp v3.0.apk
                  </div>
                  <div className="text-[11px] text-gray-500 truncate mt-1 font-mono uppercase tracking-wider">
                    MOBILE (MobSF) · Submitted by FinCo Ltd · Feb 24, 2026
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-[40%] pl-8">
                <div className="flex-1 flex justify-center">
                  <span className="bg-[#1e232b] text-gray-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm flex items-center gap-1.5 border border-gray-700/60 font-mono tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                    QUEUED
                  </span>
                </div>
                <div className="flex-shrink-0 w-32 flex justify-end">
                  <button
                    onClick={() =>
                      showToast(
                        "Scan Initiated",
                        "MobSF analysis starting for FinanceApp"
                      )
                    }
                    className="bg-purple-900/30 hover:bg-purple-800/50 border border-purple-700/50 text-purple-300 text-[11px] px-4 py-1.5 rounded transition-all flex items-center gap-1.5 font-bold tracking-wide shadow-[0_0_10px_rgba(147,51,234,0.1)] hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] uppercase"
                  >
                    ▶ Start Scan
                  </button>
                </div>
              </div>
            </div>

            {/* --- Queue Item 3: Scanning Github --- */}
            <div className="flex items-center justify-between py-4 px-4 border-b border-gray-800/40 last:border-0 hover:bg-[#161a20] transition-colors rounded-md group">
              <div className="flex items-center gap-4 w-[60%]">
                <div className="w-10 h-10 rounded-md bg-[#1a1e24] border border-gray-700/50 flex items-center justify-center shrink-0 shadow-inner">
                  <span className="text-pink-400 text-lg">🐙</span>
                </div>
                <div className="overflow-hidden">
                  <div className="text-white font-semibold text-sm truncate group-hover:text-pink-300 transition-colors">
                    github.com/finco/backend
                  </div>
                  <div className="text-[11px] text-gray-500 truncate mt-1 font-mono uppercase tracking-wider">
                    GITHUB · Submitted by FinCo Ltd · Feb 24, 2026
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-[40%] pl-8">
                <div className="flex-1 flex justify-center">
                  <span className="bg-cyan-900/20 text-cyan-400 border border-cyan-800/50 text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm flex items-center gap-1.5 font-mono tracking-wider shadow-[0_0_8px_rgba(34,211,238,0.1)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    SCANNING
                  </span>
                </div>
                <div className="flex-shrink-0 w-32 flex justify-end">
                  <span className="text-cyan-400 font-mono text-xs font-bold tracking-widest">
                    42% ···
                  </span>
                </div>
              </div>
            </div>

            {/* --- Queue Item 4: Scanning Network --- */}
            <div className="flex items-center justify-between py-4 px-4 border-b border-gray-800/40 last:border-0 hover:bg-[#161a20] transition-colors rounded-md group">
              <div className="flex items-center gap-4 w-[60%]">
                <div className="w-10 h-10 rounded-md bg-[#1a1e24] border border-gray-700/50 flex items-center justify-center shrink-0 shadow-inner">
                  <span className="text-gray-400 text-lg">🖧</span>
                </div>
                <div className="overflow-hidden">
                  <div className="text-white font-semibold text-sm truncate group-hover:text-gray-300 transition-colors">
                    10.0.0.0/16 — DataCenter Alpha
                  </div>
                  <div className="text-[11px] text-gray-500 truncate mt-1 font-mono uppercase tracking-wider">
                    NETWORK (OpenVAS) · Submitted by Acme Corp · Feb 23, 2026
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-[40%] pl-8">
                <div className="flex-1 flex justify-center">
                  <span className="bg-cyan-900/20 text-cyan-400 border border-cyan-800/50 text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm flex items-center gap-1.5 font-mono tracking-wider shadow-[0_0_8px_rgba(34,211,238,0.1)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    SCANNING
                  </span>
                </div>
                <div className="flex-shrink-0 w-32 flex justify-end">
                  <span className="text-cyan-400 font-mono text-xs font-bold tracking-widest">
                    78% ···
                  </span>
                </div>
              </div>
            </div>

            {/* --- Queue Item 5: Needs Review --- */}
            <div className="flex items-center justify-between py-4 px-4 border-b border-gray-800/40 last:border-0 hover:bg-[#161a20] transition-colors rounded-md group">
              <div className="flex items-center gap-4 w-[60%]">
                <div className="w-10 h-10 rounded-md bg-[#1a1e24] border border-gray-700/50 flex items-center justify-center shrink-0 shadow-inner">
                  <span className="text-yellow-500 text-lg">🌐</span>
                </div>
                <div className="overflow-hidden">
                  <div className="text-white font-semibold text-sm truncate group-hover:text-yellow-300 transition-colors">
                    https://api.retailer.com/v2
                  </div>
                  <div className="text-[11px] text-gray-500 truncate mt-1 font-mono uppercase tracking-wider">
                    WEB · Submitted by Retail Co · Feb 22, 2026
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-[40%] pl-8">
                <div className="flex-1 flex justify-center">
                  <span className="bg-yellow-900/20 text-yellow-500 border border-yellow-800/50 text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm flex items-center gap-1.5 font-mono tracking-wider shadow-[0_0_8px_rgba(234,179,8,0.1)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    NEEDS REVIEW
                  </span>
                </div>
                <div className="flex-shrink-0 w-32 flex justify-end">
                  <button className="bg-transparent hover:bg-[#232830] border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white text-[11px] px-4 py-1.5 rounded transition-all uppercase font-bold tracking-wide">
                    Review →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQueueDashboard;