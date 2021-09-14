import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Azimuth(props) {
  const { config } = props;

  return (
    <SectionContainer>
      <SectionHeader>Azimuth</SectionHeader>
      <Paper>TODO: {JSON.stringify(config)}</Paper>
    </SectionContainer>
  );
}

export default Azimuth;
