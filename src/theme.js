import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1C3557',
      light: '#2d5080',
      dark: '#0e1f33',
      contrastText: '#fff',
    },
    secondary: {
      main: '#C9A84C',
      light: '#d9bd72',
      dark: '#9c7e30',
      contrastText: '#fff',
    },
    background: { default: '#f0f2f5', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Roboto",sans-serif' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 12 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default theme;
