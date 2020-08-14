import React from 'react';
// import ReactGA from 'react-ga';
import MaintenanceHeader from './MaintenanceHeader';
import MaintenanceError from './MaintenanceError';
import MaintenanceFooter from './MaintenanceFooter';

function App() {
  // ReactGA.initialize('UA-133341631-3');
  // ReactGA.pageview('/maintenance');
  return (
    <>
      <MaintenanceHeader />
      <MaintenanceError />
      <MaintenanceFooter />
    </>
  );
}

export default App;
