import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Samples(props) {
  const { searchTerms } = props;

  return (
    <SectionContainer>
      TODO: &quot;View Data on Search Page&quot; button TODO: &quot;Add to List&quot; button
      <SectionHeader>Samples</SectionHeader>
      <Paper>TODO: table of samples matching {searchTerms}</Paper>
    </SectionContainer>
  );
}

export default Samples;
