import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Button from '@material-ui/core/Button';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import useSearchData from 'js/hooks/useSearchData';

import { getSearchURL } from '../utils';

function Assays(props) {
  const { searchTerms } = props;
  const searchUrl = getSearchURL('Dataset', searchTerms);

  const query = {
    size: 0,
    query: { bool: { must_not: { exists: { field: 'next_revision_uuid' } } } },
    aggs: {
      mapped_data_types: {
        filter: { term: { 'entity_type.keyword': 'Dataset' } },
        aggs: {
          'mapped_data_types.keyword': { terms: { field: 'mapped_data_types.keyword', size: 100 } },
          'mapped_data_types.keyword_count': { cardinality: { field: 'mapped_data_types.keyword' } },
        },
      },
    },
  };

  const { searchData } = useSearchData(query);

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
      <Paper>
        <pre>{JSON.stringify(searchData, null, 2)}</pre>
      </Paper>
    </SectionContainer>
  );
}

export default Assays;
