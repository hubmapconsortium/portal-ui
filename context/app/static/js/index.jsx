import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';
import Providers from './components/Providers';
import Footer from './components/Footer';
import { Header } from './components/Header';

const urlPath = window.location.pathname;

const isRoute = (route) => urlPath.startsWith(route);

const availableRoutes = [
  '/browse',
  '/search',
  '/dev-search',
  '/preview',
  '/collections',
  '/docs',
  '/VERSION',
  '/client-side-error',
];

// eslint-disable-next-line no-undef
if ('maintenance_mode' in flaskData && flaskData.maintenance_mode) {
  ReactDOM.render(
    <Providers>
      <Header isMaintenanceMode />
      <div className="main-content">Under Construction</div>
      <Footer isMaintenanceMode />
    </Providers>,
    document.getElementById('react-content'),
  );
} else if (urlPath === '/' || availableRoutes.some(isRoute)) {
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
