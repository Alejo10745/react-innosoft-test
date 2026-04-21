import React, { useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Menu,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppContext } from "../context/AppContext";

const SIDEBAR_W = 240;
const NAV = [
  { label: "Inicio", path: "/app/inicio", icon: "home" },
  { label: "Consulta Clientes", path: "/app/clientes", icon: "people" },
];

/**
 * Shell Component - Layout principal con AppBar y Drawer
 * Sigue principios de Material Design
 */
export function Shell({ children }) {
  const { user, setUser, showSnack } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const doLogout = () => {
    setMenuAnchor(null);
    setUser(null);
    showSnack("Sesión cerrada correctamente.", "info");
    history.push("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const pageTitle =
    NAV.find((n) => isActive(n.path))?.label || "Panel Ejecutivo";

  const SidebarContent = () => (
    <Box
      sx={{
        width: SIDEBAR_W,
        height: "100%",
        background: "linear-gradient(180deg,#0e1f33 0%,#1C3557 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          padding: "20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1,
              background: "#C9A84C",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-icons"
              style={{ color: "#fff", fontSize: 22 }}
            >
              business_center
            </span>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                lineHeight: 1.2,
              }}
            >
              Executive
            </Typography>
            <Typography
              sx={{
                color: "#C9A84C",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: 0.5,
              }}
            >
              SUITE PRO
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User card */}
      <Box
        sx={{
          padding: "24px 16px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            margin: "0 auto 12px",
            background: "linear-gradient(135deg,#C9A84C,#9c7e30)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
            color: "#fff",
            border: "3px solid rgba(201,168,76,0.4)",
            boxShadow: "0 0 0 4px rgba(201,168,76,0.1)",
          }}
        >
          {user?.username?.charAt(0) || "U"}
        </Box>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
          {user?.username}
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            marginTop: 0.5,
          }}
        >
          {user?.email}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            marginTop: 1,
            padding: "3px 12px",
            background: "rgba(201,168,76,0.15)",
            border: "1px solid rgba(201,168,76,0.35)",
            borderRadius: 2.5,
            fontSize: 11,
            color: "#C9A84C",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          ADMINISTRADOR
        </Box>
      </Box>

      <Divider sx={{ background: "rgba(255,255,255,0.08)" }} />

      {/* Nav items */}
      <List sx={{ padding: "12px 8px", flex: 1 }}>
        {NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem
              disablePadding
              key={item.path}
              onClick={() => {
                history.push(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 1,
                  marginBottom: 0.5,
                  background: active ? "rgba(201,168,76,0.15)" : "transparent",
                  borderLeft: active
                    ? "3px solid #C9A84C"
                    : "3px solid transparent",
                  color: active ? "#C9A84C" : "rgba(255,255,255,0.6)",
                  "&:hover": {
                    background: "rgba(201,168,76,0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: "inherit",
                  }}
                >
                  <span className="material-icons">{item.icon}</span>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { fontWeight: active ? 700 : 500, fontSize: "0.95rem" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Desktop sidebar */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Box sx={{ width: SIDEBAR_W, flexShrink: 0, height: "100vh" }}>
          <SidebarContent />
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { width: SIDEBAR_W, border: "none" } }}
        >
          <SidebarContent />
        </Drawer>
      </Box>

      {/* Main column */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* AppBar */}
        <AppBar
          position="static"
          elevation={1}
          sx={{
            background: "#fff",
            color: "#1C3557",
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ color: "#1C3557", marginRight: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                width: 4,
                height: 24,
                background: "#C9A84C",
                borderRadius: 0.25,
                marginRight: 1.5,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1C3557",
                flex: 1,
              }}
            >
              {pageTitle}
            </Typography>

            {/* Nombre del usuario */}
            <Box
              display="flex"
              alignItems="center"
              sx={{ gap: 0.75, marginRight: 1 }}
            >
              <span
                className="material-icons"
                style={{ fontSize: 18, color: "#1C3557" }}
              >
                person
              </span>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#1C3557" }}
              >
                {user?.username}
              </Typography>
            </Box>

            {/* Avatar → menú de cuenta */}
            <Tooltip title="Opciones de cuenta">
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: "linear-gradient(135deg,#C9A84C,#9c7e30)",
                    fontWeight: 700,
                  }}
                >
                  {user?.username?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  marginTop: 0.75,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#1C3557" }}
                >
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem onClick={doLogout} sx={{ mt: 0.5 }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Contenido de página */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            padding: 3,
            background: "#f0f2f5",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
