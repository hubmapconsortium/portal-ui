import React from 'react';
// import ReactGA from 'react-ga';
import Providers from 'js/components/Providers';
import MaintenanceHeader from './MaintenanceHeader';
import MaintenanceError from './MaintenanceError';
import MaintenanceFooter from './MaintenanceFooter';

function App() {
  // ReactGA.initialize('UA-133341631-3');
  // ReactGA.pageview('/maintenance');
  return (
    <Providers>
      <MaintenanceHeader />
      <MaintenanceError />
      <MaintenanceFooter />
    </Providers>
  );
}

export default App;
