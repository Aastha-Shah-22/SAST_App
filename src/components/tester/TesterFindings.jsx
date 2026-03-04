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
  Chip,
  IconButton
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

// Sample data mapped from the screenshot
const findingsData = [
  {
    id: '#F01',
    title: 'Directory Traversal — /files',
    target: 'api.retailer.com/v2',
    severity: 'CRITICAL',
    source: 'Manual',
    hasEvidence: true,
    actionType: 'publish_remove'
  },
  {
    id: '#F02',
    title: 'CVE-2024-3289 — Apache',
    target: '10.0.0.187:8080',
    severity: 'HIGH',
    source: 'OpenVAS',
    hasEvidence: true,
    actionType: 'publish_remove'
  },
  {
    id: '#F03',
    title: 'Weak SSL Cipher (RC4)',
    target: 'api.retailer.com',
    severity: 'MEDIUM',
    source: 'OpenVAS',
    hasEvidence: true,
    actionType: 'publish_remove'
  },
  {
    id: '#F04',
    title: 'False Positive — Port 8443',
    target: '10.0.0.44',
    severity: 'LOW',
    source: 'OpenVAS',
    hasEvidence: false,
    actionType: 'mark_fp'
  },
];

// Helper to get matching colors for severity badges
const getSeverityStyles = (severity) => {
  switch (severity) {
    case 'CRITICAL':
      return { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    case 'HIGH':
      return { color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)' };
    case 'MEDIUM':
      return { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' };
    case 'LOW':
      return { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' };
    default:
      return { color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.1)' };
  }
};

const TesterFindings = ({ showToast }) => {
  const handleAction = (message) => {
    if (showToast) {
      showToast(message);
    } else {
      console.log(message);
    }
  };

  return (
    // Outer Box with dark background spanning full height, centering content
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B0E14', py: 6, display: 'flex', justifyContent: 'center' }}>
      <Container maxWidth="lg">
        
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
              Manage Findings
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
              Add manual findings, evidence & scrub false positives
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => handleAction('Add Finding modal would open here')}
            sx={{
              color: '#c084fc', // Purple text
              borderColor: 'rgba(192, 132, 252, 0.3)',
              backgroundColor: 'rgba(192, 132, 252, 0.05)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                borderColor: '#c084fc',
                backgroundColor: 'rgba(192, 132, 252, 0.15)',
              }
            }}
          >
            + Add Manual Finding
          </Button>
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
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>SOURCE</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>EVIDENCE</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {findingsData.map((row) => {
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
                          border: `1px solid ${color}40`, 
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </TableCell>

                    {/* Source */}
                    <TableCell>
                      <Chip
                        label={row.source}
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

                    {/* Evidence Column */}
                    <TableCell>
                      {row.hasEvidence ? (
                        <IconButton 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#1E2433', 
                            color: '#94a3b8', 
                            borderRadius: '4px',
                            border: '1px solid #2A3143',
                            '&:hover': { backgroundColor: '#2A3143' }
                          }}
                        >
                          <AttachFileIcon sx={{ fontSize: '1rem', transform: 'rotate(45deg)' }} />
                        </IconButton>
                      ) : (
                        <Typography sx={{ color: '#64748b', ml: 1 }}>—</Typography>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        {row.actionType === 'publish_remove' ? (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAction(`Publish ${row.id}`)}
                              sx={{
                                color: '#c084fc',
                                borderColor: 'rgba(192, 132, 252, 0.3)',
                                backgroundColor: 'rgba(192, 132, 252, 0.05)',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { borderColor: '#c084fc', backgroundColor: 'rgba(192, 132, 252, 0.15)' }
                              }}
                            >
                              Publish
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAction(`Remove FP ${row.id}`)}
                              sx={{
                                color: '#ef4444',
                                borderColor: 'rgba(239, 68, 68, 0.3)',
                                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' }
                              }}
                            >
                              Remove FP
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CloseIcon sx={{ fontSize: '1rem !important' }} />}
                            onClick={() => handleAction(`Mark FP ${row.id}`)}
                            sx={{
                              color: '#ef4444',
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                              backgroundColor: 'rgba(239, 68, 68, 0.05)',
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' }
                            }}
                          >
                            Mark FP
                          </Button>
                        )}
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

export default TesterFindings;