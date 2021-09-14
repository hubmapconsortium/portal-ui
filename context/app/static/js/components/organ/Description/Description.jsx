import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Description(props) {
  const { children } = props;

  return (
    <SectionContainer>
      <SectionHeader>Description</SectionHeader>
      <Paper>{children}</Paper>
    </SectionContainer>
  );
}

export default Description;
