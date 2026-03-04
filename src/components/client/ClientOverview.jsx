import React from 'react';

function ClientOverview({ switchTab }) {
  // Stat card data mapped for cleaner code
  const stats = [
    { label: 'CRITICAL', value: '4', sub: '+2 this week', color: '#ef4444', border: 'border-b-[#ef4444]' },
    { label: 'HIGH', value: '11', sub: '3 under review', color: '#f59e0b', border: 'border-b-[#f59e0b]' },
    { label: 'MEDIUM', value: '23', sub: '8 fixed', color: '#f97316', border: 'border-b-[#f97316]' },
    { label: 'LOW', value: '39', sub: '31 fixed', color: '#10b981', border: 'border-b-[#10b981]' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 text-white font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl sm:text-[32px] font-black tracking-[0.1em] uppercase">
            Security Overview
          </h2>
          <div className="text-[#8b949e] text-xs font-mono mt-2">
            Last updated: 25 Feb 2026 · 3 active projects
          </div>
        </div>
        <button className="bg-[#11161d] border border-[#1f2937] hover:bg-[#1a2332] text-white text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
          Export Summary
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-[#0f151c] border border-[#1f2937] rounded-lg p-5 flex flex-col justify-between min-h-[120px] ${stat.border} border-b-[3px]`}
          >
            <div className="text-[#6b7280] text-[11px] font-mono uppercase tracking-widest mb-2">
              {stat.label}
            </div>
            <div>
              {/* Approximating the wide blocky font from the design */}
              <div 
                className="text-5xl font-black tracking-tighter mb-1"
                style={{ color: stat.color, transform: 'scaleY(0.8) scaleX(1.1)', transformOrigin: 'left' }}
              >
                {stat.value}
              </div>
              <div className="text-[#8b949e] text-xs font-mono">
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle Grid (Charts & Projects) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Panel: Vulnerability Trend */}
        <div className="bg-[#0f151c] border border-[#1f2937] rounded-lg p-5 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[15px] font-bold">Vulnerability Trend <span className="text-[#8b949e] font-normal">(30 days)</span></h3>
            <span className="bg-[#11161d] border border-[#1f2937] text-[#8b949e] text-[10px] font-mono uppercase px-2 py-1 rounded">
              Open Issues
            </span>
          </div>
          
          {/* Mock Bar Chart */}
          <div className="flex-1 flex items-end gap-3 sm:gap-4 h-[100px] mb-4">
            <div className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full bg-[#ef4444] rounded-sm h-[60px]"></div>
              <span className="text-[10px] text-[#6b7280] font-mono uppercase">Crit</span>
            </div>
            <div className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full bg-[#f59e0b] rounded-sm h-[48px]"></div>
              <span className="text-[10px] text-[#6b7280] font-mono uppercase">High</span>
            </div>
            <div className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full bg-[#f97316] rounded-sm h-[32px]"></div>
              <span className="text-[10px] text-[#6b7280] font-mono uppercase">Med</span>
            </div>
            <div className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full bg-[#10b981] rounded-sm h-[20px]"></div>
              <span className="text-[10px] text-[#6b7280] font-mono uppercase">Low</span>
            </div>
            <div className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full bg-[#3b82f6] rounded-sm h-[12px]"></div>
              <span className="text-[10px] text-[#6b7280] font-mono uppercase">Info</span>
            </div>
          </div>
          
          <div className="text-xs font-mono text-[#8b949e]">
            Total Open: <span className="text-white font-bold">38</span> &nbsp;&nbsp; 
            Fixed: <span className="text-[#10b981] font-bold">42</span> &nbsp;&nbsp; 
            Reopened: <span className="text-[#f59e0b] font-bold">3</span>
          </div>
        </div>

        {/* Right Panel: Active Projects */}
        <div className="bg-[#0f151c] border border-[#1f2937] rounded-lg p-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold">Active Projects</h3>
            <button 
              onClick={() => switchTab && switchTab('submit')}
              className="text-[#00e5ff] text-xs font-mono font-bold hover:underline transition-all"
            >
              + Add Target
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-[#6b7280] text-[10px] font-mono uppercase tracking-widest border-b border-[#1f2937]">
                  <th className="pb-3 font-normal">Target</th>
                  <th className="pb-3 font-normal">Type</th>
                  <th className="pb-3 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                <tr className="border-b border-[#1f2937]/50">
                  <td className="py-4 text-white font-bold">api.acme.io</td>
                  <td className="py-4"><span className="bg-[#161c24] border border-[#1f2937] text-[#8b949e] px-2 py-0.5 rounded text-[10px]">WEB</span></td>
                  <td className="py-4 text-right">
                    <span className="text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-1 rounded text-[11px] font-bold tracking-wider">● SCANNING</span>
                  </td>
                </tr>
                <tr className="border-b border-[#1f2937]/50">
                  <td className="py-4 text-white font-bold">AcmeApp v2.1</td>
                  <td className="py-4"><span className="bg-[#161c24] border border-[#1f2937] text-[#8b949e] px-2 py-0.5 rounded text-[10px]">MOBILE</span></td>
                  <td className="py-4 text-right">
                    <span className="text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded text-[11px] font-bold tracking-wider">● IN REVIEW</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 text-white font-bold">github/acme-corp</td>
                  <td className="py-4"><span className="bg-[#161c24] border border-[#1f2937] text-[#8b949e] px-2 py-0.5 rounded text-[10px]">GITHUB</span></td>
                  <td className="py-4 text-right">
                    <span className="text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded text-[11px] font-bold tracking-wider">● COMPLETE</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Bottom Panel: Recent Findings */}
      <div className="bg-[#0f151c] border border-[#1f2937] rounded-lg p-5 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[15px] font-bold">Recent Findings</h3>
          <button className="text-[#00e5ff] text-xs font-mono font-bold hover:underline transition-all">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
            <thead>
              <tr className="text-[#6b7280] text-[10px] font-mono uppercase tracking-widest border-b border-[#1f2937]">
                <th className="pb-3 font-normal">Finding</th>
                <th className="pb-3 font-normal">Severity</th>
                <th className="pb-3 font-normal">Target</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              <tr>
                <td className="py-4">
                  <div className="text-white font-bold font-sans text-sm mb-1">SQL Injection in /login</div>
                  <div className="text-[#6b7280] text-xs">api.acme.io/auth</div>
                </td>
                <td className="py-4">
                  <span className="text-[#ef4444] bg-[#ef4444]/10 px-2 py-1 rounded text-[11px] font-bold tracking-wider">● CRITICAL</span>
                </td>
                <td className="py-4">
                  <span className="bg-[#161c24] border border-[#1f2937] text-[#8b949e] px-2 py-0.5 rounded text-[10px]">WEB</span>
                </td>
                <td className="py-4">
                  <span className="text-[#ef4444] bg-[#ef4444]/10 px-2 py-1 rounded text-[11px] font-bold tracking-wider">● OPEN</span>
                </td>
                <td className="py-4 text-right">
                  <button className="bg-transparent border border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors">
                    Mark Fixed
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default ClientOverview;