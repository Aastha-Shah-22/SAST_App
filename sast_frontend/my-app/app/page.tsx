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
    <html lang="en">
      <body style={{ margin: 0 }}>
        {/* Flex container to hold Sidebar + Content side-by-side */}
        <Box sx={{ display: 'flex' }}>
          
          {/* 1. The Fixed Sidebar */}
          <Sidebar />

          {/* 2. The Main Content Area (Dynamic) */}
          <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f7fa', minHeight: '100vh', p: 3 }}>
            {children}
          </Box>
          
        </Box>
      </body>
    </html>
  );
}