import React from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import CircleIcon from '@mui/icons-material/Circle';

// Sample data mapped from your screenshot
const issuesData = [
  {
    id: '#004',
    title: 'Open Redis Port (6379)',
    target: '192.168.1.45',
    severity: 'HIGH',
    client: 'Acme Corp',
    date: 'Feb 24, 2026',
  },
  {
    id: '#005',
    title: 'Missing HSTS Header',
    target: 'api.acme.io',
    severity: 'MEDIUM',
    client: 'Acme Corp',
    date: 'Feb 24, 2026',
  },
  {
    id: '#009',
    title: 'Outdated OpenSSL (1.0.2)',
    target: 'staging.retailer.com',
    severity: 'CRITICAL',
    client: 'Retail Co',
    date: 'Feb 23, 2026',
  },
];

// Helper to get matching colors for severity badges
const getSeverityStyles = (severity) => {
  switch (severity) {
    case 'HIGH':
      return { color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)' };
    case 'MEDIUM':
      return { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' };
    case 'CRITICAL':
      return { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    default:
      return { color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.1)' };
  }
};

const TesterReview = ({ showToast }) => {
  // Mock function if showToast isn't passed as a prop
  const handleAction = (title, message, type = 'success') => {
    if (showToast) {
      showToast(title, message, type);
    } else {
      console.log(`${title}: ${message}`);
    }
  };

  return (
    // Outer Box with dark background spanning full height for testing, centering content
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B0E14', py: 6, display: 'flex', justifyContent: 'center' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
            Verify Fixes
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
            5 issues marked fixed by clients — pending re-test
          </Typography>
        </Box>

        {/* Table Section */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: '#12161F', 
            border: '1px solid #1E2433',
            borderRadius: 2,
            boxShadow: 'none'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #1E2433' } }}>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>#</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>FINDING</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>SEVERITY</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>CLIENT</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>MARKED FIXED</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>RETEST ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issuesData.map((row) => {
                const { color, bgColor } = getSeverityStyles(row.severity);
                
                return (
                  <TableRow key={row.id} sx={{ '& td': { borderBottom: '1px solid #1E2433' }, '&:last-child td': { borderBottom: 0 } }}>
                    {/* ID */}
                    <TableCell sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {row.id}
                    </TableCell>

                    {/* Finding details */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>
                          {row.title}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.8rem', mt: 0.5 }}>
                          {row.target}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Severity Badge */}
                    <TableCell>
                      <Chip
                        icon={<CircleIcon sx={{ fontSize: '8px !important', color: `${color} !important` }} />}
                        label={row.severity}
                        size="small"
                        sx={{
                          backgroundColor: bgColor,
                          color: color,
                          fontWeight: 'bold',
                          borderRadius: '4px',
                          border: `1px solid ${color}40`, // slight opacity border
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </TableCell>

                    {/* Client */}
                    <TableCell>
                      <Chip
                        label={row.client}
                        size="small"
                        sx={{
                          backgroundColor: '#1E2433',
                          color: '#94a3b8',
                          borderRadius: '4px',
                          border: '1px solid #2A3143',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>

                    {/* Date */}
                    <TableCell sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {row.date}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={() => handleAction('Issue Closed', 'Client notified.')}
                          sx={{
                            color: '#10b981',
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: '#10b981',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)'
                            }
                          }}
                        >
                          Close Issue
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UndoIcon />}
                          onClick={() => handleAction('Issue Reopened', 'Fix insufficient.', 'error')}
                          sx={{
                            color: '#ef4444',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: '#ef4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }
                          }}
                        >
                          Reopen
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default TesterReview;