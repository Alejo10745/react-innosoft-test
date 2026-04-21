import React, { createContext, useState, useEffect } from 'react';
import { updateApiState } from '../services/api';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  // auth = { token, userid, username, expiration }
  const [auth, setAuth] = useState(null);
  // credentials = { username, password } — solo en memoria, para refresh silencioso
  const [credentials, setCredentials] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });

  // Sincronizar estado con el módulo axios cada vez que cambia auth o credentials
  useEffect(() => {
    updateApiState({
      token: auth?.token || null,
      credentials,
      onRefresh: (data) =>
        setAuth((prev) => ({
          ...prev,
          token: data.token,
          expiration: data.expiration,
        })),
    });
  }, [auth, credentials]);

  const showSnack = (msg, sev = 'success') =>
    setSnack({ open: true, msg, sev });
  const hideSnack = () => setSnack((s) => ({ ...s, open: false }));

  // user = auth (alias para compatibilidad con Shell y rutas privadas)
  const user = auth;
  const setUser = (val) => {
    setAuth(val);
    if (!val) setCredentials(null); // limpiar credenciales al cerrar sesión
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        auth,
        setAuth,
        credentials,
        setCredentials,
        showSnack,
        snack,
        hideSnack,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
