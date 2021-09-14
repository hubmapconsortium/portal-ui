import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Assays(props) {
  const { searchTerms } = props;

  return (
    <SectionContainer>
      <SectionHeader>Assays</SectionHeader>
      <Paper>TODO: {searchTerms}</Paper>
    </SectionContainer>
  );
}

export default Assays;
