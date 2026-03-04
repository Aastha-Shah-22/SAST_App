import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function SubmitTarget() {
  const [activeType, setActiveType] = useState('web');

  const targetTypes = [
    { id: 'web', label: 'Web URL', icon: '🌐' },
    { id: 'mobile', label: 'Mobile App', icon: '📱' },
    { id: 'github', label: 'GitHub Profile', icon: '🐙' },
    { id: 'network', label: 'Network / IP', icon: '🖧' },
  ];

  const queueData = [
    { asset: 'api.acme.io', type: 'WEB', date: 'Feb 24, 2026', status: 'SCANNING', statusColor: 'text-[#00e5ff]', progress: 75, progressColor: 'bg-[#00e5ff]' },
    { asset: 'AcmeApp v2.1.apk', type: 'MOBILE', date: 'Feb 22, 2026', status: 'IN REVIEW', statusColor: 'text-[#f59e0b]', progress: 100, progressColor: 'bg-[#f59e0b]' },
    { asset: 'github.com/acme-corp', type: 'GITHUB', date: 'Feb 18, 2026', status: 'COMPLETE', statusColor: 'text-[#10b981]', progress: 100, progressColor: 'bg-[#10b981]' },
    { asset: '192.168.1.0/24', type: 'NETWORK', date: 'Feb 15, 2026', status: 'ARCHIVED', statusColor: 'text-[#6b7280]', progress: 0, progressColor: 'bg-transparent' },
  ];

  // Shared MUI Table Cell styling to match dark theme
  const cellStyle = { borderColor: '#1f2937', color: 'white', fontFamily: 'inherit', py: 2.5 };
  const headStyle = { ...cellStyle, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-wide text-white mb-1">
          Submit Target
        </h2>
        <p className="text-[#8b949e] font-mono text-xs">Add assets for security assessment</p>
      </div>

      {/* Submission Form Area */}
      <div className="bg-[#0f151c] border border-[#1f2937] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4 text-white font-semibold">
          <span className="text-[#ef4444]">🎯</span> Target Type
        </div>
        
        {/* Target Type Toggles */}
        <div className="flex flex-wrap gap-3 mb-6">
          {targetTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                activeType === t.id 
                  ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-white shadow-[0_0_10px_rgba(0,229,255,0.1)]' 
                  : 'bg-[#11161d] border-[#1f2937] text-[#8b949e] hover:bg-[#1a2332]'
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="e.g. https://api.acme.io" 
            className="flex-1 bg-[#11161d] border border-[#1f2937] text-white font-mono text-sm rounded-lg py-3 px-4 focus:outline-none focus:border-[#00e5ff]"
          />
          <button className="bg-[#00e5ff] hover:bg-[#00cce6] text-black font-bold text-sm px-6 rounded-lg transition-colors whitespace-nowrap">
            Submit &rarr;
          </button>
        </div>
      </div>

      {/* Submission Queue Table */}
      <div>
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="text-lg font-bold text-white">Submission Queue</h3>
          <span className="text-[#8b949e] text-[10px] font-mono border border-[#1f2937] px-2 py-1 rounded bg-[#11161d] uppercase tracking-wider">
            4 Assets
          </span>
        </div>

        <TableContainer className="bg-[#0f151c] rounded-xl border border-[#1f2937]">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headStyle}>Asset</TableCell>
                <TableCell sx={headStyle}>Type</TableCell>
                <TableCell sx={headStyle}>Submitted</TableCell>
                <TableCell sx={headStyle}>Status</TableCell>
                <TableCell sx={headStyle} align="right">Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queueData.map((row, idx) => (
                <TableRow key={idx} hover sx={{ '&:hover': { backgroundColor: '#161c24' } }}>
                  <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }}>{row.asset}</TableCell>
                  <TableCell sx={cellStyle}>
                    <span className="bg-[#11161d] border border-[#1f2937] text-[#8b949e] px-2 py-1 rounded text-[10px] font-mono">
                      {row.type}
                    </span>
                  </TableCell>
                  <TableCell sx={{ ...cellStyle, color: '#8b949e', fontSize: '12px', fontFamily: 'monospace' }}>
                    {row.date}
                  </TableCell>
                  <TableCell sx={cellStyle}>
                    <span className={`${row.statusColor} font-bold text-[11px] font-mono tracking-wider`}>
                      ● {row.status}
                    </span>
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    <div className="w-16 h-1.5 bg-[#1f2937] rounded-full ml-auto overflow-hidden flex">
                      <div className={`h-full ${row.progressColor}`} style={{ width: `${row.progress}%` }}></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  );
}

export default SubmitTarget;