import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Assays(props) {
  const { title } = props;

  return (
    <SectionContainer>
      <SectionHeader>Assays</SectionHeader>
      <Paper>TODO: {title}</Paper>
    </SectionContainer>
  );
}

export default Assays;
