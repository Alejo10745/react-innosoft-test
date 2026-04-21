import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

// Contraseña: 8-20 chars, al menos 1 número, 1 mayúscula, 1 minúscula
const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register() {
  const { showSnack } = useContext(AppContext);
  const history = useHistory();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const doRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      showSnack('Todos los campos son requeridos.', 'error');
      return;
    }
    if (!emailRegex.test(form.email)) {
      showSnack('Ingresa un correo electrónico válido.', 'error');
      return;
    }
    if (!pwRegex.test(form.password)) {
      showSnack(
        'La contraseña debe tener entre 8 y 20 caracteres, al menos una mayúscula, una minúscula y un número.',
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      await api.post('api/Authenticate/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      showSnack('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => history.push('/login'), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Error al crear la cuenta. Intenta de nuevo.';
      showSnack(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { label: 'Nombre Usuario *', name: 'username', type: 'text', icon: 'person' },
    { label: 'Dirección de correo *', name: 'email', type: 'email', icon: 'email' },
    { label: 'Contraseña *', name: 'password', type: 'password', icon: 'lock' },
  ];

  return (
    <Box
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(145deg,#0e1f33 0%,#1C3557 55%,#2d5080 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Paper elevation={12} style={{ width: 460, padding: 40, borderRadius: 20 }}>
        <Box textAlign="center" mb={3}>
          <Box
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg,#1C3557,#C9A84C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-icons" style={{ color: '#fff', fontSize: 36 }}>
              person_add
            </span>
          </Box>
          <Typography variant="h5" style={{ fontWeight: 700, color: '#1C3557' }}>
            Registro
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crea tu cuenta en Executive Suite
          </Typography>
        </Box>

        {FIELDS.map((f) => (
          <TextField
            key={f.name}
            fullWidth
            variant="outlined"
            margin="dense"
            label={f.label}
            name={f.name}
            type={f.type}
            value={form[f.name]}
            onChange={handle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-icons" style={{ color: '#1C3557', fontSize: 20 }}>
                    {f.icon}
                  </span>
                </InputAdornment>
              ),
            }}
          />
        ))}

        <Typography
          variant="caption"
          color="text.secondary"
          style={{ display: 'block', marginTop: 6, marginBottom: 4, paddingLeft: 2 }}
        >
          Contraseña: 8–20 caracteres, al menos una mayúscula, minúscula y número.
        </Typography>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={doRegister}
            disabled={loading}
            style={{ height: 52, borderRadius: 26, fontWeight: 700, fontSize: 16 }}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: '#fff' }} />
            ) : (
              'REGISTRARME'
            )}
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#1C3557', fontWeight: 700, textDecoration: 'none' }}>
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
