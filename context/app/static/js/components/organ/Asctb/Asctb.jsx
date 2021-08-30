import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Asctb(props) {
  const { asctb } = props;

  return (
    <SectionContainer>
      <SectionHeader>Asctb</SectionHeader>
      <Paper>TODO: {JSON.stringify(asctb)}</Paper>
    </SectionContainer>
  );
}

export default Asctb;
