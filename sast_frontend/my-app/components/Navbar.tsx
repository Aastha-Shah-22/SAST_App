'use client';

import React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'View Results', path: '/results' },
  { label: 'Create New Test', path: '/create-test' },
];

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Box>
            {navItems.map((item) => (
              <Button key={item.label} color="inherit" component={Link} href={item.path}>
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}