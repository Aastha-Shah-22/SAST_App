// app/view-scans/page.tsx
'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

// Define our data type
interface ScanData {
  id: number;
  Scans: string;
  type: string;
  status: string;
  Scan_Initiated: string;
}

// Mock Data
const rows: ScanData[] = [
  { id: 1, Scans: 'Client_A-Report1', type: 'DAST', status: 'Open', Scan_Initiated: '2024-02-05' },
{ id: 2, Scans: 'Client_A-Report2', type: 'SAST', status: 'Open', Scan_Initiated: '2024-02-04' },
  { id: 3, Scans: 'Client_A-Report3', type: 'MOBSF', status: 'In Progress', Scan_Initiated: '2024-02-03' },
  { id: 4, Scans: 'Client_A-Report4', type: 'Network', status: 'Open', Scan_Initiated: '2024-02-02' },
  { id: 5, Scans: 'Client_B-Report1', type: 'DAST', status: 'Resolved', Scan_Initiated: '2024-02-01' },
  { id: 6, Scans: 'Client_B-Report2', type: 'SAST', status: 'Open', Scan_Initiated: '2024-01-31' },
];

export default function ViewScansPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
          View Scans
        </Typography>
      </Box>

      {/* Table Card */}
      <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              {['Vulnerability', 'Type', 'Status', 'Scan Initiated'].map((head) => (
                <TableCell key={head} sx={{ fontWeight: 600, color: '#475569', py: 3 }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: '#334155' }}>
                  {row.Scans}
                </TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.type}</TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.status}</TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.Scan_Initiated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}