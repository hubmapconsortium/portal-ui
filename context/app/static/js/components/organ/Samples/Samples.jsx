import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';

function Samples(props) {
  const { title } = props;

  return (
    <PaddedSectionContainer>
      <SectionHeader>Samples</SectionHeader>
      <Paper>TODO: {title}</Paper>
    </PaddedSectionContainer>
  );
}

export default Samples;
