import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Azimuth(props) {
  const { azimuth } = props;

  return (
    <SectionContainer>
      <SectionHeader>Description</SectionHeader>
      <Paper>TODO: {JSON.stringify(azimuth)}</Paper>
    </SectionContainer>
  );
}

export default Azimuth;
