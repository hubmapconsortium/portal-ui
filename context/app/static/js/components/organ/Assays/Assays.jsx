import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
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
        filter: {
          bool: {
            must: [
              {
                term: {
                  'entity_type.keyword': 'Dataset',
                },
              },
              {
                bool: {
                  should: searchTerms.map((searchTerm) => ({
                    term: { 'origin_sample.mapped_organ.keyword': searchTerm },
                  })),
                },
              },
            ],
          },
        },
        aggs: {
          'mapped_data_types.keyword': { terms: { field: 'mapped_data_types.keyword', size: 100 } },
          'mapped_data_types.keyword_count': { cardinality: { field: 'mapped_data_types.keyword' } },
        },
      },
    },
  };

  const { searchData } = useSearchData(query);
  const buckets = searchData.aggregations
    ? searchData.aggregations.mapped_data_types['mapped_data_types.keyword'].buckets
    : [];

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
        <EntitiesTable
          columns={[
            { id: 'assays', label: 'Assays' },
            { id: 'counts', label: 'Dataset Count' },
          ]}
        >
          {buckets.map((bucket) => (
            <TableRow key={bucket.key}>
              <TableCell>
                <LightBlueLink
                  href={`/search?entity_type[0]=Dataset&mapped_data_types[0]=${encodeURIComponent(bucket.key)}`}
                  variant="body2"
                >
                  {bucket.key}
                </LightBlueLink>
              </TableCell>
              <TableCell>{bucket.doc_count}</TableCell>
            </TableRow>
          ))}
        </EntitiesTable>
      </Paper>
    </SectionContainer>
  );
}

export default Assays;
