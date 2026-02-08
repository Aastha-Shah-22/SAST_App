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
} from '@mui/material';
import { startSastScan } from '@/services/scan.service';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SastScanDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    repoUrl: '',
    gitUsername: '',
    gitToken: '',
    semgrepToken: '',
    branch: 'main',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await startSastScan(form);
      alert('SAST scan started 🚀');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Start SAST Scan</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Repository URL"
            name="repoUrl"
            value={form.repoUrl}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Git Username"
            name="gitUsername"
            value={form.gitUsername}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Git Token"
            name="gitToken"
            type="password"
            value={form.gitToken}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Semgrep Token"
            name="semgrepToken"
            type="password"
            value={form.semgrepToken}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Branch"
            name="branch"
            value={form.branch}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Starting...' : 'Start Scan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
