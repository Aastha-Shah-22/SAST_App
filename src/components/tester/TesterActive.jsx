import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Chip, Stack } from '@mui/material';

const TesterActive = () => {
  return (
    // Container automatically centers the content and handles max-width
    <Container maxWidth="lg" sx={{ py: 4, width: '100%' }}>
      
      {/* Section Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h2"
          sx={{ 
            fontWeight: 800, 
            color: 'white', 
            textTransform: 'uppercase', 
            fontFamily: "'Arial Black', Impact, sans-serif",
            letterSpacing: '0.1em',
            mb: 0.5 
          }}
        >
          Active Scans
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'grey.500', 
            fontFamily: 'monospace', 
            letterSpacing: '0.05em' 
          }}
        >
          Live container monitoring
        </Typography>
      </Box>

      {/* Responsive Grid Container */}
      <Grid container spacing={3}>
        
        {/* Panel 1: OpenVAS */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              bgcolor: '#13161b', 
              border: '1px solid #1f2937', 
              borderRadius: 2, 
              boxShadow: 3,
              transition: 'border-color 0.3s',
              '&:hover': { borderColor: '#164e63' } 
            }}
          >
            {/* Card Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(31, 41, 55, 0.8)', bgcolor: '#161a20' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography sx={{ fontSize: '1.2rem', color: '#22d3ee' }}>🐳</Typography>
                <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem', letterSpacing: '0.025em' }}>
                  Container 1 — OpenVAS
                </Typography>
              </Stack>
              <Chip 
                label="RUNNING" 
                size="small" 
                icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22d3ee', ml: 1, '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } }, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}/>} 
                sx={{ 
                  bgcolor: 'rgba(22, 78, 99, 0.3)', 
                  color: '#22d3ee', 
                  border: '1px solid rgba(22, 78, 99, 0.5)', 
                  fontSize: '0.625rem', 
                  fontWeight: 'bold', 
                  borderRadius: 1,
                  boxShadow: '0 0 8px rgba(34,211,238,0.2)'
                }} 
              />
            </Box>

            {/* Card Body */}
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', mb: 0.5 }}>
                  10.0.0.0/16 — DataCenter Alpha
                </Typography>
                <Typography sx={{ fontSize: '11px', color: 'grey.500', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  Target: Network Scan · Client: Acme Corp
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                <Typography sx={{ fontSize: '11px', color: 'grey.500', fontFamily: 'monospace', textTransform: 'uppercase' }}>Progress</Typography>
                <Typography sx={{ fontSize: '11px', color: '#22d3ee', fontFamily: 'monospace', fontWeight: 'bold' }}>78%</Typography>
              </Box>

              {/* Progress Bar Container */}
              <Box sx={{ height: 8, width: '100%', bgcolor: '#1a1e24', borderRadius: 4, mb: 3, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #0e7490, #22d3ee)', borderRadius: 4, boxShadow: '0 0 10px rgba(34,211,238,0.5)' }} />
              </Box>

              {/* Terminal Output Box */}
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.6)', p: 2, borderRadius: 1, border: '1px solid #1f2937', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6, boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>
                <Typography component="div" sx={{ color: '#34d399', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  {`> Scanning host 10.0.0.187...`}<br />
                  {`> Port 22 (SSH) — OPEN`}<br />
                  {`> Port 443 (HTTPS) — OPEN`}<br />
                  {`> Port 8080 — OPEN [FLAG]`}<br />
                  {`> CVE-2024-3289 detected...`}
                </Typography>
                <Typography component="span" sx={{ color: '#22d3ee', fontWeight: 'bold', mt: 0.5, display: 'inline-block', '@keyframes blink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } }, animation: 'blink 1s step-end infinite' }}>
                  _
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel 2: MobSF */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              bgcolor: '#13161b', 
              border: '1px solid #1f2937', 
              borderRadius: 2, 
              boxShadow: 3,
              transition: 'border-color 0.3s',
              '&:hover': { borderColor: '#581c87' } 
            }}
          >
            {/* Card Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(31, 41, 55, 0.8)', bgcolor: '#161a20' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography sx={{ fontSize: '1.2rem', color: '#c084fc' }}>🐳</Typography>
                <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem', letterSpacing: '0.025em' }}>
                  Container 2 — MobSF
                </Typography>
              </Stack>
              <Chip 
                label="RUNNING" 
                size="small" 
                icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#c084fc', ml: 1, '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 } }, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}/>} 
                sx={{ 
                  bgcolor: 'rgba(88, 28, 135, 0.3)', 
                  color: '#c084fc', 
                  border: '1px solid rgba(88, 28, 135, 0.5)', 
                  fontSize: '0.625rem', 
                  fontWeight: 'bold', 
                  borderRadius: 1,
                  boxShadow: '0 0 8px rgba(168,85,247,0.2)'
                }} 
              />
            </Box>

            {/* Card Body */}
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', mb: 0.5 }}>
                  AcmeApp v2.1.apk
                </Typography>
                <Typography sx={{ fontSize: '11px', color: 'grey.500', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  Target: Android APK · Client: Acme Corp
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                <Typography sx={{ fontSize: '11px', color: 'grey.500', fontFamily: 'monospace', textTransform: 'uppercase' }}>Progress</Typography>
                <Typography sx={{ fontSize: '11px', color: '#c084fc', fontFamily: 'monospace', fontWeight: 'bold' }}>91%</Typography>
              </Box>

              {/* Progress Bar Container */}
              <Box sx={{ height: 8, width: '100%', bgcolor: '#1a1e24', borderRadius: 4, mb: 3, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: '91%', background: 'linear-gradient(90deg, #7e22ce, #c084fc)', borderRadius: 4, boxShadow: '0 0 10px rgba(168,85,247,0.5)' }} />
              </Box>

              {/* Terminal Output Box */}
              <Box sx={{ bgcolor: 'rgba(0,0,0,0.6)', p: 2, borderRadius: 1, border: '1px solid #1f2937', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6, boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>
                <Typography component="div" sx={{ color: '#34d399', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  {`> Decompiling APK...`}<br />
                  {`> Analysing manifest... done`}
                </Typography>
                <Typography component="div" sx={{ color: '#fbbf24', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  {`> [HIGH] android:allowBackup=true`}
                </Typography>
                <Typography component="div" sx={{ color: '#f87171', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  {`> [CRIT] Plaintext password in SharedPrefs`}
                </Typography>
                <Typography component="div" sx={{ color: '#fbbf24', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  {`> [MED] Exported Activity: .MainActivity`}
                </Typography>
                <Typography component="span" sx={{ color: '#c084fc', fontWeight: 'bold', mt: 0.5, display: 'inline-block', '@keyframes blink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } }, animation: 'blink 1s step-end infinite' }}>
                  _
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Container>
  );
};

export default TesterActive;