import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'typeface-inter';

import theme from './theme';
import './index.css';
import App from './components/App';
import Footer from './components/Footer';
import { Header } from './components/Header';

const urlPath = window.location.pathname;

const isRoute = (route) => urlPath.startsWith(route);

const availableRoutes = ['/browse', '/search'];

if (urlPath === '/' || availableRoutes.some(isRoute)) {
  ReactDOM.render(
    // eslint-disable-next-line no-undef
    <App flaskData={flaskData} />,
    document.getElementById('react-content'),
  );
} else {
  // temp solution to integrate react header and footer
  ReactDOM.render(
    // eslint-disable-next-line no-undef
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
    </ThemeProvider>,
    document.getElementById('react-header'),
  );
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Footer />
    </ThemeProvider>,
    document.getElementById('react-footer'),
  );
}
