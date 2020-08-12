import React from 'react';
import Providers from '../Providers';
import Footer from '../Footer';
import { Header } from '../Header';

function Maintenance() {
  return (
    <Providers>
      <Header isMaintenanceMode />
      <div className="main-content">Under Construction!</div>
      <Footer isMaintenanceMode />
    </Providers>
  );
}

export default Maintenance;
