import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function Findings() {
  const findingsData = [
    { id: '#001', title: 'SQL Injection in /login', target: 'api.acme.io/auth/login', severity: 'CRITICAL', type: 'WEB', tool: 'OpenVAS', status: 'OPEN', actions: 'mark' },
    { id: '#002', title: 'Hardcoded AWS Credentials', target: 'github/acme-corp/src/config.js', severity: 'CRITICAL', type: 'GITHUB', tool: 'Manual', status: 'REOPENED', actions: 'mark' },
    { id: '#003', title: 'Insecure Data Storage (SharedPrefs)', target: 'AcmeApp v2.1 — com.acme.app', severity: 'HIGH', type: 'MOBILE', tool: 'MobSF', status: 'OPEN', actions: 'mark' },
    { id: '#004', title: 'Open Redis Port (6379)', target: '192.168.1.45 — NETWORK', severity: 'HIGH', type: 'NETWORK', tool: 'OpenVAS', status: 'FIXED', actions: 'verified' },
    { id: '#005', title: 'Missing HSTS Header', target: 'api.acme.io', severity: 'MEDIUM', type: 'WEB', tool: 'OpenVAS', status: 'FIXED', actions: 'verified' },
  ];

  const getSeverityStyle = (sev) => {
    if (sev === 'CRITICAL') return 'text-[#ef4444] bg-[#ef4444]/10';
    if (sev === 'HIGH') return 'text-[#f59e0b] bg-[#f59e0b]/10';
    if (sev === 'MEDIUM') return 'text-[#f97316] bg-[#f97316]/10';
    return 'text-[#10b981] bg-[#10b981]/10';
  };

  const cellStyle = { borderColor: '#1f2937', color: 'white', fontFamily: 'inherit', py: 2 };
  const headStyle = { ...cellStyle, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, py: 1.5 };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans">
      
      {/* Header & Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-wide text-white mb-1">All Findings</h2>
          <p className="text-[#8b949e] font-mono text-xs">77 total vulnerabilities across 4 projects</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#11161d] border border-[#1f2937] hover:bg-[#1a2332] text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
            Filter ▾
          </button>
          <button className="bg-[#11161d] border border-[#1f2937] hover:bg-[#1a2332] text-white text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* MUI Table */}
      <TableContainer className="bg-[#0f151c] rounded-xl border border-[#1f2937]">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{...headStyle, width: '60px'}}>#</TableCell>
              <TableCell sx={headStyle}>Finding</TableCell>
              <TableCell sx={headStyle}>Severity</TableCell>
              <TableCell sx={headStyle}>Target</TableCell>
              <TableCell sx={headStyle}>Tool</TableCell>
              <TableCell sx={headStyle}>Status</TableCell>
              <TableCell sx={headStyle} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {findingsData.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:hover': { backgroundColor: '#161c24' } }}>
                <TableCell sx={{ ...cellStyle, color: '#6b7280', fontFamily: 'monospace', fontSize: '12px' }}>
                  {row.id}
                </TableCell>
                <TableCell sx={cellStyle}>
                  <div className="font-bold text-[14px] text-white">{row.title}</div>
                  <div className="text-[#6b7280] font-mono text-[11px] mt-0.5">{row.target}</div>
                </TableCell>
                <TableCell sx={cellStyle}>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${getSeverityStyle(row.severity)}`}>
                    ● {row.severity}
                  </span>
                </TableCell>
                <TableCell sx={cellStyle}>
                  <span className="bg-[#11161d] border border-[#1f2937] text-[#8b949e] px-2 py-1 rounded text-[10px] font-mono">
                    {row.type}
                  </span>
                </TableCell>
                <TableCell sx={cellStyle}>
                  <span className="border border-[#1f2937] text-[#6b7280] px-2 py-1 rounded text-[10px] font-mono">
                    {row.tool}
                  </span>
                </TableCell>
                <TableCell sx={cellStyle}>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${row.status === 'FIXED' ? 'text-[#10b981] bg-[#10b981]/10' : row.status === 'REOPENED' ? 'text-[#f59e0b] bg-[#f59e0b]/10' : 'text-[#ef4444] bg-[#ef4444]/10'}`}>
                    ● {row.status}
                  </span>
                </TableCell>
                <TableCell sx={cellStyle} align="right">
                  <div className="flex items-center justify-end gap-2">
                    {row.actions === 'mark' ? (
                      <button className="border border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors">
                        Mark Fixed
                      </button>
                    ) : (
                      <span className="text-[#10b981] text-xs font-semibold px-3 py-1.5">
                        Verified ✓
                      </span>
                    )}
                    <button className="p-1.5 rounded bg-[#11161d] border border-[#1f2937] text-[#6b7280] hover:text-white transition-colors">
                      👁
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}

export default Findings;