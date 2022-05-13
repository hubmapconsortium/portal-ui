import React from 'react';
import ReactGA from 'react-ga';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Providers from 'js/components/Providers';
import Footer from 'js/components/Footer';
import Error from 'js/pages/Error';
import MaintenanceHeader from './MaintenanceHeader';

function MaintenancePage() {
  ReactGA.initialize('UA-133341631-3');
  ReactGA.pageview('/maintenance');
  const { trackPageView } = useMatomo(); // Should be inside Providers.
  trackPageView({ href: '/maintenance' });
  return (
    <>
      <MaintenanceHeader />
      <div className="main-content">
        <Error isMaintenancePage />
      </div>
      <Footer isMaintenancePage />
    </>
  );
}

function App() {
  return (
    <Providers>
      <MaintenancePage />
    </Providers>
  );
}

export default App;
