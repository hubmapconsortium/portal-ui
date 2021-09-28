import React from 'react';
import format from 'date-fns/format';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import EntitiesTable from 'js/shared-styles/tables/EntitiesTable';
import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useSearchHits } from 'js/hooks/useSearchData';

import { getSearchURL } from '../utils';

function Samples(props) {
  const { searchTerms } = props;
  const searchUrl = getSearchURL('Sample', searchTerms);

  const columns = [
    { id: 'hubmap_id', label: 'Sample' },
    { id: 'donor.mapped_metadata.age_value', label: 'Donor Age' },
    { id: 'donor.mapped_metadata.sex', label: 'Donor Sex' },
    { id: 'donor.mapped_metadata.race', label: 'Donor Race' },
    { id: 'descendant_counts.entity_type.Dataset', label: 'Derived Dataset Count' },
    { id: 'last_modified_timestamp', label: 'Last Modified' },
  ];

  const query = {
    query: {
      bool: {
        must_not: {
          exists: {
            field: 'next_revision_uuid',
          },
        },
      },
    },
    post_filter: {
      bool: {
        must: [
          {
            term: {
              'entity_type.keyword': 'Sample',
            },
          },
          {
            bool: {
              should: searchTerms.map((searchTerm) => ({ term: { 'origin_sample.mapped_organ.keyword': searchTerm } })),
            },
          },
        ],
      },
    },
    _source: columns.map((column) => column.id),
  };

  const { searchHits } = useSearchHits(query);

  return (
    <SectionContainer>
      <SpacedSectionButtonRow
        leftText={<SectionHeader>Samples</SectionHeader>}
        buttons={
          <Button color="primary" variant="contained" component="a" href={searchUrl}>
            View All Samples
          </Button>
        }
      />
      <Paper>
        <EntitiesTable columns={columns}>
          {searchHits.map(
            ({ _id: uuid, _source: { hubmap_id, donor, descendant_counts, last_modified_timestamp } }) => (
              <TableRow key={uuid}>
                <TableCell>
                  <LightBlueLink href={`/browse/sample/${uuid}`} variant="body2">
                    {hubmap_id}
                  </LightBlueLink>
                </TableCell>
                <TableCell>{donor.mapped_metadata.age_value}</TableCell>
                <TableCell>{donor.mapped_metadata.sex}</TableCell>
                <TableCell>{donor.mapped_metadata.race}</TableCell>
                <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
                <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
              </TableRow>
            ),
          )}
        </EntitiesTable>
      </Paper>
    </SectionContainer>
  );
}

export default Samples;
