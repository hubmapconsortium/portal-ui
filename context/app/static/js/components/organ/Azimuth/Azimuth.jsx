import React from 'react';

import Paper from '@material-ui/core/Paper';

import { Vitessce } from 'vitessce';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Azimuth(props) {
  const { config } = props;

  return (
    <SectionContainer>
      <SectionHeader>Reference-Based Analysis</SectionHeader>
      <Paper>TODO: {JSON.stringify(config)}</Paper>
      <Vitessce config={config.vitessce_config} />
    </SectionContainer>
  );
}

export default Azimuth;
