import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

export function MantenimientoClientes() {
  const { user, showSnack } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();

  const isNew = location.pathname.includes('/nuevo');

  const FORM_INIT = {
    nombre: '',
    apellidos: '',
    identificacion: '',
    telefonoCelular: '',
    otroTelefono: '',
    direccion: '',
    fNacimiento: '',
    fAfiliacion: '',
    sexo: '',
    resenaPersonal: '',
    imagen: null,
    interesFK: '',
  };

  const [form, setForm] = useState(FORM_INIT);
  const [imgPreview, setImgPreview] = useState(null);
  const [intereses, setIntereses] = useState([]);
  const [loadingIntereses, setLoadingIntereses] = useState(true);
  const [loadingCliente, setLoadingCliente] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // ── Cargar intereses al montar ─────────────────────────────────────────
  useEffect(() => {
    const fetchIntereses = async () => {
      try {
        const { data } = await api.get('api/Intereses/Listado');
        setIntereses(data || []);
      } catch {
        showSnack('No se pudo cargar el listado de intereses.', 'error');
      } finally {
        setLoadingIntereses(false);
      }
    };
    fetchIntereses();
  }, []);

  // ── Cargar datos del cliente si es edición ─────────────────────────────
  useEffect(() => {
    if (isNew) return;
    const fetchCliente = async () => {
      try {
        const { data } = await api.get(`api/Cliente/Obtener/${id}`);
        setForm({
          nombre: data.nombre || '',
          apellidos: data.apellidos || '',
          identificacion: data.identificacion || '',
          telefonoCelular: data.telefonoCelular || '',
          otroTelefono: data.otroTelefono || '',
          direccion: data.direccion || '',
          fNacimiento: data.fNacimiento ? data.fNacimiento.split('T')[0] : '',
          fAfiliacion: data.fAfiliacion ? data.fAfiliacion.split('T')[0] : '',
          sexo: data.sexo || '',
          resenaPersonal: data.resenaPersonal || '',
          imagen: data.imagen || null,
          interesFK: data.interesesId || '',
        });
        if (data.imagen) setImgPreview(data.imagen);
      } catch {
        showSnack('No se pudo cargar la información del cliente.', 'error');
      } finally {
        setLoadingCliente(false);
      }
    };
    fetchCliente();
  }, [id, isNew]);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validar tipo de imagen
    if (!file.type.startsWith('image/')) {
      showSnack('El archivo seleccionado no es una imagen válida.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(reader.result);
      setForm((f) => ({ ...f, imagen: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ── Validaciones ───────────────────────────────────────────────────────
  const validate = () => {
    const req = ['nombre', 'apellidos', 'identificacion', 'telefonoCelular', 'direccion', 'fNacimiento', 'fAfiliacion', 'sexo', 'resenaPersonal', 'interesFK'];
    for (const field of req) {
      if (!form[field]) {
        showSnack('Todos los campos marcados con * son requeridos.', 'error');
        return false;
      }
    }
    if (form.nombre.length > 50)       { showSnack('Nombre: máximo 50 caracteres.', 'error');         return false; }
    if (form.apellidos.length > 100)   { showSnack('Apellidos: máximo 100 caracteres.', 'error');      return false; }
    if (form.identificacion.length > 20){ showSnack('Identificación: máximo 20 caracteres.', 'error'); return false; }
    if (form.telefonoCelular.length > 20){ showSnack('Tel. Celular: máximo 20 caracteres.', 'error');  return false; }
    if (form.otroTelefono.length > 20) { showSnack('Tel. Otro: máximo 20 caracteres.', 'error');       return false; }
    if (form.direccion.length > 200)   { showSnack('Dirección: máximo 200 caracteres.', 'error');      return false; }
    if (form.resenaPersonal.length > 200){ showSnack('Reseña: máximo 200 caracteres.', 'error');       return false; }
    return true;
  };

  // ── Guardar (crear o actualizar) ───────────────────────────────────────
  const doSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isNew) {
        // POST /api/Cliente/Crear
        await api.post('api/Cliente/Crear', {
          nombre:          form.nombre,
          apellidos:       form.apellidos,
          identificacion:  form.identificacion,
          telefonoCelular: form.telefonoCelular,
          otroTelefono:    form.otroTelefono || '',
          direccion:       form.direccion,
          fNacimiento:     form.fNacimiento,       // "YYYY-MM-DD"
          fAfiliacion:     form.fAfiliacion,       // "YYYY-MM-DD"
          sexo:            form.sexo,
          resenaPersonal:  form.resenaPersonal,
          imagen:          form.imagen || '',
          interesFK:       form.interesFK,
          usuarioId:       user.userid,
        });
        showSnack('¡Cliente creado exitosamente!', 'success');
      } else {
        // POST /api/Cliente/Actualizar
        await api.post('api/Cliente/Actualizar', {
          id:              id,
          nombre:          form.nombre,
          apellidos:       form.apellidos,
          identificacion:  form.identificacion,
          celular:         form.telefonoCelular,   // ← nombre diferente en el API
          otroTelefono:    form.otroTelefono || '',
          direccion:       form.direccion,
          fNacimiento:     form.fNacimiento,
          fAfiliacion:     form.fAfiliacion,
          sexo:            form.sexo,
          resennaPersonal: form.resenaPersonal,    // ← doble 'n' en el API
          imagen:          form.imagen || '',
          interesFK:       form.interesFK,
          usuarioId:       user.userid,
        });
        showSnack('Cliente editado satisfactoriamente.', 'success');
      }
      history.push('/app/clientes');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Hubo un inconveniente con la transacción. Intenta de nuevo.';
      showSnack(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loadingIntereses || loadingCliente;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress style={{ color: '#1C3557' }} />
      </Box>
    );
  }

  const TEXT_FIELDS = [
    { label: 'Identificación *',    name: 'identificacion',  type: 'text', icon: 'badge',         sm: 4 },
    { label: 'Nombre *',            name: 'nombre',          type: 'text', icon: 'person',         sm: 4 },
    { label: 'Apellidos *',         name: 'apellidos',       type: 'text', icon: 'person_outline', sm: 4 },
    { label: 'Teléfono Celular *',  name: 'telefonoCelular', type: 'tel',  icon: 'phone_iphone',   sm: 4 },
    { label: 'Teléfono Otro',       name: 'otroTelefono',   type: 'tel',  icon: 'phone',          sm: 4 },
  ];

  const DATE_FIELDS = [
    { label: 'Fecha de Nacimiento *', name: 'fNacimiento', sm: 4 },
    { label: 'Fecha de Afiliación *', name: 'fAfiliacion', sm: 4 },
  ];

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton
          onClick={() => history.push('/app/clientes')}
          style={{ marginRight: 12, color: '#1C3557' }}
        >
          <span className="material-icons">arrow_back</span>
        </IconButton>
        <Box>
          <Typography variant="h4" style={{ fontWeight: 700, color: '#1C3557' }}>
            Mantenimiento de clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isNew ? 'Registro de nuevo cliente' : `Editando: ${form.nombre} ${form.apellidos}`}
          </Typography>
        </Box>
      </Box>

      <Paper elevation={2} style={{ borderRadius: 16, overflow: 'hidden' }}>
        {/* ── Header con imagen ── */}
        <Box
          style={{
            background: 'linear-gradient(135deg,#1C3557,#2d5080)',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <Box display="flex" alignItems="center" style={{ gap: 20 }}>
            {/* Avatar editable */}
            <Box style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={imgPreview || undefined}
                style={{
                  width: 80,
                  height: 80,
                  fontSize: 30,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg,#C9A84C,#9c7e30)',
                  border: '3px solid rgba(255,255,255,0.3)',
                }}
              >
                {!imgPreview &&
                  (form.nombre?.charAt(0).toUpperCase() || (
                    <span className="material-icons">person</span>
                  ))}
              </Avatar>
              <input
                type="file"
                accept="image/*"
                id="client-foto"
                style={{ display: 'none' }}
                onChange={handleImage}
              />
              <label
                htmlFor="client-foto"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#C9A84C',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}
              >
                <span className="material-icons" style={{ color: '#fff', fontSize: 15 }}>
                  camera_alt
                </span>
              </label>
            </Box>
            <Box>
              <Typography variant="h6" style={{ color: '#fff', fontWeight: 700 }}>
                {form.nombre
                  ? `${form.nombre} ${form.apellidos}`
                  : isNew
                  ? 'Nuevo Cliente'
                  : '—'}
              </Typography>
              <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {isNew ? 'Completar todos los campos *' : `ID: ${id}`}
              </Typography>
            </Box>
          </Box>

          {/* Botones en la cabecera */}
          <Box display="flex" style={{ gap: 8 }}>
            <Button
              variant="outlined"
              onClick={() => history.push('/app/clientes')}
              style={{
                borderRadius: 20,
                fontWeight: 600,
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.4)',
              }}
              startIcon={<span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>}
            >
              Regresar
            </Button>
            <Button
              variant="contained"
              onClick={doSave}
              disabled={saving}
              style={{
                borderRadius: 20,
                fontWeight: 700,
                background: '#C9A84C',
                color: '#fff',
              }}
              startIcon={
                saving ? (
                  <CircularProgress size={16} style={{ color: '#fff' }} />
                ) : (
                  <span className="material-icons" style={{ fontSize: 18 }}>save</span>
                )
              }
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </Box>
        </Box>

        <Box p={4}>
          <Typography
            variant="overline"
            style={{ color: '#1C3557', fontWeight: 700, letterSpacing: 1, fontSize: 11 }}
          >
            Datos del Cliente
          </Typography>
          <Divider style={{ marginBottom: 24, marginTop: 8 }} />

          <Grid container spacing={3}>
            {/* Campos de texto */}
            {TEXT_FIELDS.map((f) => (
              <Grid item xs={12} sm={f.sm} key={f.name}>
                <TextField
                  fullWidth
                  variant="outlined"
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
              </Grid>
            ))}

            {/* Género */}
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Género *</InputLabel>
                <Select name="sexo" value={form.sexo} onChange={handle} label="Género *">
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Fechas */}
            {DATE_FIELDS.map((f) => (
              <Grid item xs={12} sm={f.sm} key={f.name}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={f.label}
                  name={f.name}
                  type="date"
                  value={form[f.name]}
                  onChange={handle}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="material-icons" style={{ color: '#1C3557', fontSize: 20 }}>
                          calendar_today
                        </span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

            {/* Intereses */}
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Intereses *</InputLabel>
                <Select
                  name="interesFK"
                  value={form.interesFK}
                  onChange={handle}
                  label="Intereses *"
                >
                  <MenuItem value="">
                    <em>Seleccione</em>
                  </MenuItem>
                  {intereses.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Dirección *"
                name="direccion"
                value={form.direccion}
                onChange={handle}
                inputProps={{ maxLength: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="material-icons" style={{ color: '#1C3557', fontSize: 20 }}>
                        location_on
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Reseña Personal */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Reseña Personal *"
                name="resenaPersonal"
                value={form.resenaPersonal}
                onChange={handle}
                multiline
                rows={3}
                inputProps={{ maxLength: 200 }}
                helperText={`${form.resenaPersonal.length}/200`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ alignSelf: 'flex-start', marginTop: 14 }}>
                      <span className="material-icons" style={{ color: '#1C3557', fontSize: 20 }}>
                        notes
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider style={{ margin: '32px 0 24px' }} />

          <Box display="flex" justifyContent="flex-end" style={{ gap: 12 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => history.push('/app/clientes')}
              style={{ borderRadius: 22, fontWeight: 600, minWidth: 130 }}
              startIcon={<span className="material-icons">close</span>}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={doSave}
              disabled={saving}
              style={{ borderRadius: 22, fontWeight: 700, minWidth: 170 }}
              startIcon={
                saving ? (
                  <CircularProgress size={18} style={{ color: '#fff' }} />
                ) : (
                  <span className="material-icons">save</span>
                )
              }
            >
              {saving ? 'Guardando…' : isNew ? 'Guardar Cliente' : 'Actualizar Cliente'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
