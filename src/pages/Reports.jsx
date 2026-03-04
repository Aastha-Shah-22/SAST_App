import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function Reports() {
  const reportsData = [
    { name: 'Web Assessment — Final', target: 'api.acme.io', date: 'Feb 25, 2026', findings: '4 CRITICAL', badgeColor: 'text-[#ef4444] bg-[#ef4444]/10' },
    { name: 'Mobile App Assessment', target: 'AcmeApp v2.1', date: 'Feb 23, 2026', findings: '7 HIGH', badgeColor: 'text-[#f59e0b] bg-[#f59e0b]/10' },
    { name: 'GitHub Secrets Audit', target: 'github/acme-corp', date: 'Feb 18, 2026', findings: '12 MEDIUM', badgeColor: 'text-[#f97316] bg-[#f97316]/10' },
    { name: 'Network Scan Report Q4', target: '192.168.1.0/24', date: 'Jan 30, 2026', findings: '9 LOW', badgeColor: 'text-[#10b981] bg-[#10b981]/10' },
  ];

  const cellStyle = { borderColor: '#1f2937', color: 'white', fontFamily: 'inherit', py: 3 };
  const headStyle = { ...cellStyle, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, py: 2 };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-wide text-white mb-1">Reports</h2>
        <p className="text-[#8b949e] font-mono text-xs">Download full assessment reports</p>
      </div>

      {/* MUI Table */}
      <TableContainer className="bg-[#0f151c] rounded-xl border border-[#1f2937]">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headStyle}>Report Name</TableCell>
              <TableCell sx={headStyle}>Project</TableCell>
              <TableCell sx={headStyle}>Generated</TableCell>
              <TableCell sx={headStyle}>Findings</TableCell>
              <TableCell sx={headStyle} align="right">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportsData.map((row, idx) => (
              <TableRow key={idx} hover sx={{ '&:hover': { backgroundColor: '#161c24' } }}>
                <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }}>
                  {row.name}
                </TableCell>
                <TableCell sx={cellStyle}>
                  <span className="bg-[#11161d] border border-[#1f2937] text-[#6b7280] px-2 py-1 rounded text-[11px] font-mono">
                    {row.target}
                  </span>
                </TableCell>
                <TableCell sx={{ ...cellStyle, color: '#8b949e', fontSize: '12px', fontFamily: 'monospace' }}>
                  {row.date}
                </TableCell>
                <TableCell sx={cellStyle}>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider ${row.badgeColor}`}>
                    ● {row.findings}
                  </span>
                </TableCell>
                <TableCell sx={cellStyle} align="right">
                  <button className="bg-[#11161d] border border-[#1f2937] hover:bg-[#1a2332] text-white text-[11px] font-bold tracking-wider uppercase py-1.5 px-3 rounded-md flex items-center gap-1.5 ml-auto transition-colors">
                    ⬇ PDF
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}

export default Reports;