import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-inter';

import './index.css';
import App from './components/App';
import Providers from './components/Providers';
import Footer from './components/Footer';
import { Header } from './components/Header';

const urlPath = window.location.pathname;

const isRoute = (route) => urlPath.startsWith(route);

const availableRoutes = ['/browse', '/search', '/showcase'];

if (urlPath === '/' || availableRoutes.some(isRoute)) {
  ReactDOM.render(
    // eslint-disable-next-line no-undef
    <App flaskData={flaskData} />,
    document.getElementById('react-content'),
  );
} else {
  // temp solution to integrate react header and footer
  ReactDOM.render(
    <Providers>
      <Header />
    </Providers>,
    document.getElementById('react-header'),
  );
  ReactDOM.render(
    <Providers>
      <Footer />
    </Providers>,
    document.getElementById('react-footer'),
  );
}
