import React, { useState, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { AppContext } from "../context/AppContext";
import api from "../services/api";

export function ConsultaClientes() {
  const { user, showSnack } = useContext(AppContext);
  const history = useHistory();

  const [filters, setFilters] = useState({ nombre: "", identificacion: "" });
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [delDlg, setDelDlg] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const handleFilter = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // POST /api/Cliente/Listado
  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post(
        `${process.env.BACKEND_URL}/api/Cliente/Listado`,
        {
          identificacion: filters.identificacion || undefined,
          nombre: filters.nombre || undefined,
          usuarioId: user.userid,
        },
      );
      setClientes(data || []);
      setSearched(true);
    } catch (err) {
      showSnack(
        err.response?.data?.message ||
          "Error al obtener el listado de clientes.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [filters, user, showSnack]);

  // DELETE /api/Cliente/Eliminar/{id}
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`api/Cliente/Eliminar/${delDlg.item.id}`);
      setClientes((prev) => prev.filter((c) => c.id !== delDlg.item.id));
      showSnack(
        `Cliente "${delDlg.item.nombre} ${delDlg.item.apellidos}" eliminado correctamente.`,
      );
      setDelDlg({ open: false, item: null });
    } catch (err) {
      showSnack(
        err.response?.data?.message || "Error al eliminar el cliente.",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      {/* ── Header ── */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
        flexWrap="wrap"
        style={{ gap: 12 }}
      >
        <Box>
          <Typography
            variant="h4"
            style={{ fontWeight: 700, color: "#1C3557" }}
          >
            Consulta de Clientes
          </Typography>
          {searched && (
            <Typography variant="body2" color="text.secondary">
              {clientes.length} registro{clientes.length !== 1 ? "s" : ""}{" "}
              encontrado
              {clientes.length !== 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
        <Box display="flex" style={{ gap: 8 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<span className="material-icons">person_add</span>}
            onClick={() => history.push("/app/clientes/nuevo")}
            style={{ borderRadius: 25, fontWeight: 700, whiteSpace: "nowrap" }}
          >
            Agregar
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<span className="material-icons">arrow_back</span>}
            onClick={() => history.push("/app/inicio")}
            style={{ borderRadius: 25, fontWeight: 600, whiteSpace: "nowrap" }}
          >
            Regresar
          </Button>
        </Box>
      </Box>

      {/* ── Filtros ── */}
      <Paper
        elevation={2}
        style={{ borderRadius: 16, overflow: "hidden", marginBottom: 20 }}
      >
        <Box
          style={{
            padding: "16px 20px",
            background: "#f8f9fa",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <TextField
            placeholder="Nombre"
            name="nombre"
            value={filters.nombre}
            onChange={handleFilter}
            variant="outlined"
            size="small"
            style={{ flex: 1, minWidth: 200 }}
            InputProps={{
              style: { borderRadius: 20, background: "#fff" },
              startAdornment: (
                <InputAdornment position="start">
                  <span
                    className="material-icons"
                    style={{ color: "#9e9e9e", fontSize: 18 }}
                  >
                    person_search
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Identificación"
            name="identificacion"
            value={filters.identificacion}
            onChange={handleFilter}
            variant="outlined"
            size="small"
            style={{ flex: 1, minWidth: 200 }}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            InputProps={{
              style: { borderRadius: 20, background: "#fff" },
              startAdornment: (
                <InputAdornment position="start">
                  <span
                    className="material-icons"
                    style={{ color: "#9e9e9e", fontSize: 18 }}
                  >
                    badge
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Buscar clientes">
            <Button
              variant="contained"
              color="primary"
              onClick={buscar}
              disabled={loading}
              style={{
                borderRadius: 20,
                minWidth: 48,
                height: 40,
                padding: "0 16px",
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={16} style={{ color: "#fff" }} />
                ) : (
                  <span className="material-icons" style={{ fontSize: 20 }}>
                    search
                  </span>
                )
              }
            >
              {loading ? "Buscando…" : "Buscar"}
            </Button>
          </Tooltip>
        </Box>

        {/* ── Tabla ── */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#1C3557" }}>
                {["Identificación", "Nombre Completo", "Acciones"].map((h) => (
                  <TableCell
                    key={h}
                    align={h === "Acciones" ? "center" : "left"}
                    sx={{ color: "#fff", fontWeight: 700, fontSize: 13 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!searched ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                    <span
                      className="material-icons"
                      style={{
                        fontSize: 48,
                        color: "#c5cdd8",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      manage_search
                    </span>
                    <Typography color="text.secondary">
                      Usa el buscador para consultar clientes
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No se encontraron clientes con los filtros ingresados.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((c, i) => (
                  <TableRow
                    key={c.id}
                    hover
                    style={{ background: i % 2 === 0 ? "#fff" : "#fafbfc" }}
                  >
                    <TableCell style={{ fontWeight: 600, color: "#1C3557" }}>
                      {c.identificacion}
                    </TableCell>
                    <TableCell>
                      {c.nombre} {c.apellidos}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar cliente" placement="top">
                        <IconButton
                          size="small"
                          onClick={() =>
                            history.push(`/app/clientes/editar/${c.id}`)
                          }
                          style={{
                            color: "#1C3557",
                            background: "rgba(28,53,87,0.08)",
                            borderRadius: 8,
                            marginRight: 6,
                          }}
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: 18 }}
                          >
                            edit
                          </span>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar cliente" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => setDelDlg({ open: true, item: c })}
                          style={{
                            color: "#c62828",
                            background: "rgba(198,40,40,0.08)",
                            borderRadius: 8,
                          }}
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: 18 }}
                          >
                            delete
                          </span>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {searched && (
          <Box
            style={{
              padding: "10px 20px",
              background: "#f8f9fa",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} en
              lista
            </Typography>
          </Box>
        )}
      </Paper>

      {/* ── Dialog Eliminar ── */}
      <Dialog
        open={delDlg.open}
        onClose={() => !deleting && setDelDlg({ open: false, item: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ style: { borderRadius: 20, overflow: "hidden" } }}
      >
        <Box
          style={{
            background: "linear-gradient(135deg,#c62828,#e53935)",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            className="material-icons"
            style={{ color: "#fff", fontSize: 28 }}
          >
            warning
          </span>
          <Typography variant="h6" style={{ color: "#fff", fontWeight: 700 }}>
            Confirmar Eliminación
          </Typography>
        </Box>
        <DialogContent style={{ padding: "24px 24px 12px" }}>
          <Typography variant="body1" style={{ marginBottom: 8 }}>
            ¿Estás seguro que quieres eliminar a{" "}
            <strong style={{ color: "#1C3557" }}>
              {delDlg.item?.nombre} {delDlg.item?.apellidos}
            </strong>
            ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: "12px 24px 20px", gap: 8 }}>
          <Button
            variant="outlined"
            onClick={() => setDelDlg({ open: false, item: null })}
            disabled={deleting}
            style={{ borderRadius: 20, fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            disabled={deleting}
            style={{
              borderRadius: 20,
              background: "#e53935",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {deleting ? (
              <CircularProgress size={20} style={{ color: "#fff" }} />
            ) : (
              "Sí, Eliminar"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
