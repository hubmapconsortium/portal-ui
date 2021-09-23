import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Button from '@material-ui/core/Button';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

function Samples(props) {
  const { searchTerms } = props;
  const query = new URLSearchParams();
  query.set('entity_type[0]', 'Sample');
  searchTerms.forEach((term, i) => {
    query.set(`origin_sample.mapped_organ[${i}]`, term);
  });
  const searchUrl = `/search?${query}`;

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
