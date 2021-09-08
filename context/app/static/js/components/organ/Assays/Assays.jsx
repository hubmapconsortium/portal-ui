import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';

function Assays(props) {
  const { title } = props;

  return (
    <PaddedSectionContainer>
      <SectionHeader>Assays</SectionHeader>
      <Paper>TODO: {title}</Paper>
    </PaddedSectionContainer>
  );
}

export default Assays;
