import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';

function Asctb(props) {
  const { asctb } = props;

  return (
    <PaddedSectionContainer>
      <SectionHeader>Asctb</SectionHeader>
      <Paper>TODO: {JSON.stringify(asctb)}</Paper>
    </PaddedSectionContainer>
  );
}

export default Asctb;
