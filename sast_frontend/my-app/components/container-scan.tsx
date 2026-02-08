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
import { startContainerScan } from '@/services/scan.service';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ContainerScanDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    imageName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      console.log('Starting Container scan with payload:', form);
      setLoading(true);
      alert('Container scan started 🚢');
      onClose();
      await startContainerScan(form);
      console.log('Called the Container scan API successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to start container scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Start Container Scan</DialogTitle>
      {/* add a close button */}
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Docker Image Name"
            name="imageName"
            placeholder="e.g. nginx:latest"
            value={form.imageName}
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
          disabled={loading || !form.imageName}
        >
          {loading ? 'Starting...' : 'Start Scan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
