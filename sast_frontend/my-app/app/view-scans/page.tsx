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
  vulnerability: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: string;
  detected: string;
}

// Mock Data
const rows: ScanData[] = [
  { id: 1, vulnerability: 'SQL Injection in login form', type: 'DAST', severity: 'Critical', status: 'Open', detected: '2024-02-05' },
  { id: 2, vulnerability: 'Hardcoded API credentials', type: 'SAST', severity: 'High', status: 'Open', detected: '2024-02-04' },
  { id: 3, vulnerability: 'Insecure data storage', type: 'MOBSF', severity: 'High', status: 'In Progress', detected: '2024-02-03' },
  { id: 4, vulnerability: 'Open port 22 (SSH)', type: 'Network', severity: 'Medium', status: 'Open', detected: '2024-02-02' },
  { id: 5, vulnerability: 'Missing X-Frame-Options header', type: 'DAST', severity: 'Low', status: 'Resolved', detected: '2024-02-01' },
  { id: 6, vulnerability: 'Weak encryption algorithm', type: 'SAST', severity: 'Medium', status: 'Open', detected: '2024-01-31' },
];

// Helper for pill colors
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return '#ffebee'; // Light Red bg
    case 'High': return '#fff3e0';     // Light Orange bg
    case 'Medium': return '#fffde7';   // Light Yellow bg
    case 'Low': return '#e8f5e9';      // Light Green bg
    default: return '#f5f5f5';
  }
};

const getSeverityTextColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return '#c62828'; // Dark Red text
    case 'High': return '#ef6c00';     // Dark Orange text
    case 'Medium': return '#fbc02d';   // Dark Yellow text
    case 'Low': return '#2e7d32';      // Dark Green text
    default: return 'black';
  }
};

export default function ViewScansPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
          View Scans
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
          All detected vulnerabilities
        </Typography>
      </Box>

      {/* Table Card */}
      <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              {['Vulnerability', 'Type', 'Severity', 'Status', 'Detected'].map((head) => (
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
                  {row.vulnerability}
                </TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.type}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.severity} 
                    size="small"
                    sx={{ 
                      bgcolor: getSeverityColor(row.severity),
                      color: getSeverityTextColor(row.severity),
                      fontWeight: 'bold',
                      borderRadius: 1,
                      px: 1
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.status}</TableCell>
                <TableCell sx={{ color: '#64748b' }}>{row.detected}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}