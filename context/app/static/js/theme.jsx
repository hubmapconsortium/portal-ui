import { createMuiTheme } from '@material-ui/core/styles';

// default HuBMAP color and font theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#444A65',
    },
    secondary: {
      main: '#636363',
    },
    error: {
      main: '#DA348A',
    },
    warning: {
      main: '#D25435',
    },
    info: {
      main: '#3781D1',
    },
    success: {
      main: '#6C8938', // '#9BC551'
    },
    action: {
      disabled: 'rgba(0,0,0, 0.38)',
    },
    type: 'light',
  },
  typography: {
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 400,
      fontSize: '2.6rem',
    },
    h2: {
      fontWeight: 400,
      fontSize: '2.3rem',
    },
    h3: {
      fontWeight: 400,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 300,
      fontSize: '1.6rem',
    },
    h5: {
      fontWeight: 300,
      fontSize: '1.3rem',
    },
    h6: {
      fontWeight: 300,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      color: '#444a65',
      fontSize: '1.1rem',
    },
    subtitle2: {
      fontWeight: 500,
      color: '#444a65',
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.8rem',
    },
    button: {
      fontWeight: 500,
      textTransform: 'capitalize',
    },
  },
  shape: {
    borderRadius: 2,
  },
});

export default theme;
