import React, { useContext } from 'react';
import { Snackbar, Box, Typography } from '@mui/material';
import { AppContext } from '../context/AppContext';

const ALERT_CFG = {
  success: {
    bg: '#e8f5e9',
    border: '#43a047',
    color: '#1b5e20',
    icon: 'check_circle',
  },
  error: {
    bg: '#fdecea',
    border: '#e53935',
    color: '#b71c1c',
    icon: 'error',
  },
  info: {
    bg: '#e3f2fd',
    border: '#1e88e5',
    color: '#0d47a1',
    icon: 'info',
  },
};

function SnackAlert({ severity = 'success', message }) {
  const s = ALERT_CFG[severity] || ALERT_CFG.info;
  return (
    <Box
      display="flex"
      alignItems="center"
      style={{
        background: s.bg,
        borderLeft: `4px solid ${s.border}`,
        color: s.color,
        padding: '12px 20px',
        borderRadius: 6,
        minWidth: 320,
        gap: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <span className="material-icons" style={{ fontSize: 20 }}>
        {s.icon}
      </span>
      <Typography variant="body2" style={{ fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );
}

export function GlobalSnackbar() {
  const { snack, hideSnack } = useContext(AppContext);
  return (
    <Snackbar
      open={snack.open}
      autoHideDuration={4000}
      onClose={hideSnack}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <div>
        <SnackAlert severity={snack.sev} message={snack.msg} />
      </div>
    </Snackbar>
  );
}
