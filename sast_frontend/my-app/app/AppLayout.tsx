'use client';

import Box from '@mui/material/Box';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: '260px',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>

    </Box>
  );
}
