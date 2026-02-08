'use client'; // Required for client-side logic like checking the current URL

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to check current page
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description'; // Icon for View Scans
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const drawerWidth = 260; // Width matching your screenshot

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'View Scans', icon: <DescriptionIcon />, path: '/view-scans' },
  { text: 'New Scan', icon: <AddCircleOutlineIcon />, path: '/create-test' },
];

export default function Sidebar() {
  const pathname = usePathname(); // Get the current route (e.g., "/view-scans")

  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh',
        bgcolor: '#1e293b', // Dark slate color from your screenshot
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed', // Fix sidebar to the left
        left: 0,
        top: 0,
      }}
    >
      {/* App Title */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: 1 }}>
          VulnTest Pro
        </Typography>
      </Box>
      
      {/* Menu Items */}
      <List sx={{ pt: 0 }}>
        {menuItems.map((item) => {
          // Check if this menu item is the active one
          const isActive = pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                sx={{
                  mx: 2,
                  borderRadius: 1,
                  // Active State Styling
                  bgcolor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent', 
                  borderLeft: isActive ? '4px solid #38bdf8' : '4px solid transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8', // Blue text if active, gray if not
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit', // Inherit color from the button (blue or gray)
                    minWidth: 40 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}