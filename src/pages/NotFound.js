import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { AppContext } from '../context/AppContext';

export function NotFound() {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const goHome = () => history.push(user ? '/app/inicio' : '/login');

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg,#0e1f33,#1C3557)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Box textAlign="center" color="white">
        <Typography
          style={{
            fontSize: 140,
            fontWeight: 900,
            lineHeight: 1,
            color: '#C9A84C',
            letterSpacing: -4,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          style={{ fontWeight: 700, marginBottom: 12 }}
        >
          Página no encontrada
        </Typography>
        <Typography
          variant="body1"
          style={{
            opacity: 0.65,
            marginBottom: 36,
            maxWidth: 440,
            margin: '0 auto 36px',
          }}
        >
          La dirección que ingresaste no existe o fue removida del sistema.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={goHome}
          style={{
            background: '#C9A84C',
            color: '#fff',
            borderRadius: 26,
            padding: '12px 40px',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          <span
            className="material-icons"
            style={{ marginRight: 8, fontSize: 20 }}
          >
            home
          </span>
          Ir al Inicio
        </Button>
      </Box>
    </Box>
  );
}
