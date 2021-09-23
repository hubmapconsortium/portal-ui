import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Assays(props) {
  const { searchTerms } = props;

  return (
    <SectionContainer>
      TODO: Assays Info popover
      <SectionHeader>Assays</SectionHeader>
      TODO: Button to view all datasets
      <Paper>TODO: Table listing assay types that have been used on {searchTerms}. (Not a list of datasets)</Paper>
      TODO: Assay barchart
    </SectionContainer>
  );
}

export default Assays;
