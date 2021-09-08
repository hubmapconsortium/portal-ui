import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';

function Azimuth(props) {
  const { azimuth } = props;

  return (
    <PaddedSectionContainer>
      <SectionHeader>Description</SectionHeader>
      <Paper>TODO: {JSON.stringify(azimuth)}</Paper>
    </PaddedSectionContainer>
  );
}

export default Azimuth;
