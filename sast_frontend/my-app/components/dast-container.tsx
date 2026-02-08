'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { startDastScan } from '@/services/scan.service'; // Ensure this is exported in your service

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DastScanDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    url: '',
    quickScan: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('Starting DAST scan with payload:', form);
      
      await startDastScan(form);
      
      alert('DAST scan started 🌐');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to start DAST scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Start DAST Scan (OWASP ZAP)</DialogTitle>
      
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography variant="body2" color="text.secondary">
            Enter the live URL of the application you wish to test for vulnerabilities.
          </Typography>
          
          <TextField
            label="Target URL"
            name="url"
            placeholder="https://example.com"
            value={form.url}
            onChange={handleChange}
            fullWidth
            required
            type="url"
          />

          <FormControlLabel
            control={
              <Checkbox
                name="quickScan"
                checked={form.quickScan}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Enable Quick Scan (Baseline only)"
          />
          {form.quickScan && (
            <Typography variant="caption" color="primary" sx={{ ml: 4 }}>
              * Quick scan skips deep crawling to provide faster results.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !form.url}
          color="info"
        >
          {loading ? 'Starting Scan...' : 'Start DAST Scan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}