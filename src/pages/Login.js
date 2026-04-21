import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AppContext } from "../context/AppContext";
import api, { BASE_URL } from "../services/api";

const REMEMBER_KEY = "executive_remember_user";

export function Login() {
  const { setUser, setCredentials, showSnack } = useContext(AppContext);
  const history = useHistory();

  const [form, setForm] = useState({
    username: localStorage.getItem(REMEMBER_KEY) || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(
    !!localStorage.getItem(REMEMBER_KEY),
  );

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const doLogin = async () => {
    if (!form.username || !form.password) {
      showSnack("Usuario y contraseña son requeridos.", "error");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(
        `https://pruebareactjs.test-class.com/Api/api/Authenticate/login`,
        {
          username: form.username,
          password: form.password,
        },
      );

      console.log("Login exitoso:", data); // Debug: Ver respuesta del backend

      // Recuérdame — guarda el username en localStorage
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, form.username);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      // Guardar credenciales en memoria para refresh silencioso del token
      setCredentials({ username: form.username, password: form.password });

      // Guardar auth en contexto
      setUser({
        username: data.username,
        userid: data.userid,
        token: data.token,
        expiration: data.expiration,
      });

      showSnack("¡Bienvenido! Sesión iniciada correctamente.");
      history.push("/app/inicio");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Credenciales incorrectas. Verifica tus datos.";
      showSnack(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg,#0e1f33 0%,#1C3557 55%,#2d5080 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Paper
        elevation={12}
        style={{ width: 420, padding: 40, borderRadius: 20 }}
      >
        <Box textAlign="center" mb={4}>
          <Box
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              margin: "0 auto 16px",
              background: "linear-gradient(135deg,#1C3557,#C9A84C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-icons"
              style={{ color: "#fff", fontSize: 36 }}
            >
              business_center
            </span>
          </Box>
          <Typography
            variant="h5"
            style={{ fontWeight: 700, color: "#1C3557" }}
          >
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión empresarial profesional
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Usuario *"
          name="username"
          value={form.username}
          onChange={handle}
          onKeyDown={(e) => e.key === "Enter" && doLogin()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span
                  className="material-icons"
                  style={{ color: "#1C3557", fontSize: 20 }}
                >
                  person
                </span>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Contraseña *"
          name="password"
          type={showPw ? "text" : "password"}
          value={form.password}
          onChange={handle}
          onKeyDown={(e) => e.key === "Enter" && doLogin()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span
                  className="material-icons"
                  style={{ color: "#1C3557", fontSize: 20 }}
                >
                  lock
                </span>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setShowPw(!showPw)}
                  edge="end"
                >
                  <span className="material-icons" style={{ fontSize: 20 }}>
                    {showPw ? "visibility_off" : "visibility"}
                  </span>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              color="primary"
              size="small"
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Recuérdame
            </Typography>
          }
          style={{ marginTop: 4 }}
        />

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={doLogin}
            disabled={loading}
            style={{
              height: 52,
              borderRadius: 26,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "#fff" }} />
            ) : (
              "INICIAR SESIÓN"
            )}
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            ¿No tiene una cuenta?{" "}
            <Link
              to="/register"
              style={{
                color: "#1C3557",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Regístrese
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
