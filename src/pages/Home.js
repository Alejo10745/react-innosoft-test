import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { AppContext } from '../context/AppContext';

export function Home() {
  const { user } = useContext(AppContext);
  const history = useHistory();

  const now = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" style={{ fontWeight: 700, color: '#1C3557' }}>
          Bienvenido, {user?.username || 'Usuario'} 👋
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ marginTop: 4, textTransform: 'capitalize' }}
        >
          {now}
        </Typography>
      </Box>

      {/* Tarjeta principal */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => history.push('/app/clientes')}
          >
            <Box
              style={{
                background: 'linear-gradient(135deg,#1C3557,#2d5080)',
                padding: '32px 24px',
              }}
            >
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(201,168,76,0.2)',
                  border: '2px solid #C9A84C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <span className="material-icons" style={{ color: '#C9A84C', fontSize: 40 }}>
                  people
                </span>
              </Box>
              <Typography variant="h5" style={{ color: '#fff', fontWeight: 700 }}>
                Cuentas Clientes
              </Typography>
              <Typography
                variant="body2"
                style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}
              >
                Consulta, registra y administra los clientes de la empresa
              </Typography>
            </Box>
            <Box style={{ padding: '16px 24px' }}>
              <Button
                variant="contained"
                color="secondary"
                style={{ borderRadius: 24, fontWeight: 700, minWidth: 180 }}
                onClick={(e) => {
                  e.stopPropagation();
                  history.push('/app/clientes');
                }}
              >
                Ir a Consulta Clientes
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
