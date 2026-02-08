// app/layout.tsx
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Box from '@mui/material/Box';

export const metadata = {
  title: 'VulnTest Pro',
  description: 'Vulnerability Management Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#f1f5f9' }}>
        {/* Layout Container */}
        <Box sx={{ display: 'flex' }}>
          
          {/* 1. The Persistent Sidebar */}
          <Sidebar />

          {/* 2. Main Content Area */}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 4,
              // Push content to the right to make room for the fixed sidebar
              ml: '260px', 
              minHeight: '100vh',
            }}
          >
            {children}
          </Box>
          
        </Box>
      </body>
    </html>
  );
}