import React from 'react';
import ReactGA from 'react-ga';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Providers from 'js/components/Providers';
import Footer from 'js/components/Footer';
import Error from 'js/pages/Error';
import MaintenanceHeader from './MaintenanceHeader';

function App() {
  ReactGA.initialize('UA-133341631-3');
  ReactGA.pageview('/maintenance');
  const { trackPageView } = useMatomo();
  trackPageView({ href: '/maintenance' });
  return (
    <Providers>
      <MaintenanceHeader />
      <div className="main-content">
        <Error isMaintenancePage />
      </div>
      <Footer isMaintenancePage />
    </Providers>
  );
}

export default App;
