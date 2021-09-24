import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Button from '@material-ui/core/Button';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { getSearchURL } from '../utils';

function Assays(props) {
  const { searchTerms } = props;
  const searchUrl = getSearchURL('Dataset', searchTerms);

  return (
    <SectionContainer>
      TODO: Assays Info popover
      <SpacedSectionButtonRow
        leftText={<SectionHeader>Datasets</SectionHeader>}
        buttons={
          <Button color="primary" variant="contained" component="a" href={searchUrl}>
            View Data on Search Page
          </Button>
        }
      />
      <Paper>TODO: Table listing assay types that have been used on {searchTerms}. (Not a list of datasets)</Paper>
      TODO: Assay barchart
    </SectionContainer>
  );
}

export default Assays;
