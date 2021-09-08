import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';

function Description(props) {
  const { description } = props;

  return (
    <PaddedSectionContainer>
      <SectionHeader>Description</SectionHeader>
      <Paper>TODO: {description}</Paper>
    </PaddedSectionContainer>
  );
}

export default Description;
