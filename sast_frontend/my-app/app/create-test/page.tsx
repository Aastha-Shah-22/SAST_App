'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Avatar from '@mui/material/Avatar';
import SastScanDialog from '@/components/sast-scan';
import ContainerScanDialog from '@/components/container-scan';
import AppScanDialog from '@/components/app-scan';
import DASTScanDialog from '@/components/dast-container';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LockIcon from '@mui/icons-material/Lock';

const scanOptions = [
  {
    title: 'SAST',
    subtitle: 'Static Application Security Testing - Analyze source code for vulnerabilities',
    icon: <SearchIcon fontSize="medium" />,
    color: '#e3f2fd', // Light Blue background for icon
    iconColor: '#1976d2', // Blue icon
  },
  {
    title: 'DAST',
    subtitle: 'Dynamic Application Security Testing - Test running applications for vulnerabilities',
    icon: <LanguageIcon fontSize="medium" />,
    color: '#e0f7fa', // Light Cyan
    iconColor: '#00bcd4', // Cyan
  },
  {
    title: 'MOBSF',
    subtitle: 'Mobile Security Framework - Analyze mobile application security',
    icon: <SmartphoneIcon fontSize="medium" />,
    color: '#f3e5f5', // Light Purple
    iconColor: '#9c27b0', // Purple
  },
  {
    title: 'Network Vulnerability',
    subtitle: 'Scan network infrastructure for security weaknesses',
    icon: <LockIcon fontSize="medium" />,
    color: '#fff3e0', // Light Orange
    iconColor: '#ed6c02', // Orange
  },
  {
    title: 'Container',
    subtitle: 'Scan container images for security weaknesses',
    icon: <LockIcon fontSize="medium" />,
    color: '#fff3e0', // Light Orange
    iconColor: '#96de23', // Orange
  },
];

export default function CreateTest() {
  const [openSast, setOpenSast] = useState(false);
  const [openContainer, setOpenContainer] = useState(false);
  const [openDast, setOpenDast] = useState(false);
const [openApp, setOpenApp] = useState(false);
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          New Scan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a vulnerability scan type
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={3}>
        {scanOptions.map((option) => (
          <Grid size={{ xs: 12, md: 6 }} key={option.title}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                '&:hover': { boxShadow: 3 } // Hover effect
              }}
            >
              <CardActionArea sx={{ height: '100%', p: 2 }} 
              onClick={() => {
                  if (option.title === 'SAST') setOpenSast(true) ;
                  else if (option.title === 'DAST') setOpenDast(true);
                  else if (option.title === 'MOBSF') setOpenApp(true);
                  else if (option.title === 'Container') setOpenContainer(true);
                }}
                >
                <CardContent>
                  {/* Icon Box */}
                  <Avatar 
                    sx={{ 
                      bgcolor: option.color, 
                      color: option.iconColor,
                      width: 56, 
                      height: 56, 
                      mb: 2 
                    }}
                    variant="rounded"
                  >
                    {option.icon}
                  </Avatar>

                  {/* Text Content */}
                  <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.subtitle}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {openSast && <SastScanDialog open={openSast} onClose={() => setOpenSast(false)} />}
      {openContainer && <ContainerScanDialog open={openContainer} onClose={() => setOpenContainer(false)} />}
      {openApp && <AppScanDialog open={openApp} onClose={() => setOpenApp(false)} />}
      {openDast && <DASTScanDialog open={openDast} onClose={() => setOpenDast(false)} />}
    </Container>
  );
}