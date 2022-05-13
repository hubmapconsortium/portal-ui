import React from 'react';
import Providers from 'js/components/Providers';
import Footer from 'js/components/Footer';
import Error from 'js/pages/Error';

import { trackPageView } from 'js/helpers/trackers';
import MaintenanceHeader from './MaintenanceHeader';

function App() {
  trackPageView('/maintenance');
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
