import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Button from '@material-ui/core/Button';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { getSearchURL } from '../utils';

function Samples(props) {
  const { searchTerms } = props;
  const searchUrl = getSearchURL('Sample', searchTerms);

  return (
    <SectionContainer>
      TODO: &quot;Add to List&quot; button
      <SpacedSectionButtonRow
        leftText={<SectionHeader>Samples</SectionHeader>}
        buttons={
          <Button color="primary" variant="contained" component="a" href={searchUrl}>
            View Data on Search Page
          </Button>
        }
      />
      <Paper>TODO: table of samples matching {searchTerms}</Paper>
    </SectionContainer>
  );
}

export default Samples;
