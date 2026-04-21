import React, { useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { AppProvider, AppContext } from "./context/AppContext";
import { GlobalSnackbar } from "./components/GlobalSnackbar";
import { Shell } from "./components/Shell";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { ConsultaClientes } from "./pages/ConsultaClientes";
import { MantenimientoClientes } from "./pages/MantenimientoClientes";

/**
 * PrivateRoute - Componente para proteger rutas privadas
 * Solo permite acceso si el usuario está autenticado
 */
function PrivateRoute({ children }) {
  const { user } = useContext(AppContext);
  return user ? children : <Redirect to="/login" />;
}

/**
 * AppRoutes - Contenedor de todas las rutas
 * Requiere estar dentro de AppProvider para acceso al contexto
 */
function AppRoutes() {
  const { user } = useContext(AppContext);

  return (
    <Switch>
      {/* Rutas públicas */}
      <Route exact path="/login">
        {user ? <Redirect to="/app/inicio" /> : <Login />}
      </Route>

      <Route exact path="/register">
        {user ? <Redirect to="/app/inicio" /> : <Register />}
      </Route>

      {/* Rutas privadas dentro de Shell */}
      <Route path="/app">
        <PrivateRoute>
          <Shell>
            <Switch>
              <Route exact path="/app/inicio" component={Home} />
              <Route exact path="/app/clientes" component={ConsultaClientes} />
              <Route
                exact
                path="/app/clientes/nuevo"
                component={MantenimientoClientes}
              />
              <Route
                exact
                path="/app/clientes/editar/:id"
                component={MantenimientoClientes}
              />
              <Route component={NotFound} />
            </Switch>
          </Shell>
        </PrivateRoute>
      </Route>

      {/* Redirigir raíz a login o inicio según autenticación */}
      <Route exact path="/">
        {user ? <Redirect to="/app/inicio" /> : <Redirect to="/login" />}
      </Route>

      {/* 404 - Cualquier otra ruta */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * App - Componente raíz
 * Configura: ThemeProvider, AppProvider, GlobalSnackbar, Router, Rutas
 */
function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalSnackbar />
          <AppRoutes />
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
