import './globals.css';
import Sidebar from '@/components/Sidebar';
import Box from '@mui/material/Box';

export const metadata = {
  title: 'VulnTest Pro',
  description: 'Security Vulnerability Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* 1. The Fixed Sidebar */}
      <Sidebar />

      {/* 2. The Main Content Area (Dynamic) */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f7fa', minHeight: '100vh', p: 3 }}>
        {children}
      </Box>
      
    </Box>
  );
}