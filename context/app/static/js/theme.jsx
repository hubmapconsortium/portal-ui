import { createMuiTheme } from '@material-ui/core/styles';

// default HuBMAP color and font theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#444A65',
      hover: 'brightness(108%)',
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
      light: '#9CB965',
    },
    white: {
      main: '#fff',
      hover: 'brightness(96%)',
    },
    action: {
      disabled: 'rgba(0,0,0, 0.38)',
    },
    transparentGray: {
      main: 'rgba(144, 144, 144, 0.1)',
    },
    collectionsDivider: {
      main: 'rgba(0, 0, 0, 0.12)',
    },
    type: 'light',
  },
  typography: {
    fontFamily: 'Inter Variable, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 300,
      fontSize: '2.6rem',
    },
    h2: {
      fontWeight: 300,
      fontSize: '2.3rem',
    },
    h3: {
      fontWeight: 300,
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
      fontSize: '1.1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontWeight: 300,
      fontSize: '0.95rem',
    },
    body2: {
      fontWeight: 300,
      fontSize: '0.8rem',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 300,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'capitalize',
    },
  },
  shape: {
    borderRadius: 2,
  },
});

export default theme;
