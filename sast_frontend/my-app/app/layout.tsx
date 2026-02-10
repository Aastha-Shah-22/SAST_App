import './globals.css';
import AppLayout from './AppLayout';
import Providers from './providers';

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
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
