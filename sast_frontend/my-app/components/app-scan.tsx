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
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { startAppScan } from '@/services/scan.service'; // Ensure this exists in your service

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AppScanDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    apkPath: '',
    originalName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('Starting App scan with payload:', form);
      alert('Mobile App scan started 📱');
      onClose();
      await startAppScan(form);
    } catch (err: any) {
      alert(err.message || 'Failed to start app scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Start Mobile App Scan (MobSF)</DialogTitle>
      
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="APK/IPA File Path"
            name="apkPath"
            placeholder="/tmp/uploads/app-release.apk"
            value={form.apkPath}
            onChange={handleChange}
            fullWidth
            required
            helperText="Provide the absolute path to the mobile binary on the server"
          />

          <TextField
            label="Original App Name (Optional)"
            name="originalName"
            placeholder="MyBankingApp"
            value={form.originalName}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !form.apkPath}
          color="secondary" // Giving it a distinct color from Container scan
        >
          {loading ? 'Processing...' : 'Start MobSF Scan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}