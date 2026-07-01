import React from 'react';
import HeaderAppBar from 'js/components/Header/HeaderAppBar';
import HubmapLogo from 'js/components/Header/HubmapLogo';

function MaintenanceHeader() {
  return (
    <HeaderAppBar elevation={0} shouldConstrainWidth={false}>
      <HubmapLogo />
    </HeaderAppBar>
  );
}

export default MaintenanceHeader;
