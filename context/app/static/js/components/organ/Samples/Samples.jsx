/* eslint-disable no-underscore-dangle */
import React, { useMemo } from 'react';
import format from 'date-fns/format';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import { InternalLink } from 'js/shared-styles/Links';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useSearchHits } from 'js/hooks/useSearchData';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import AddItemsToListDialog from 'js/components/savedLists/AddItemsToListDialog';
import { getDonorAgeString } from 'js/helpers/functions';

import { StyledSectionHeader } from './style';
import { getSearchURL } from '../utils';

const columns = [
  { id: 'hubmap_id', label: 'Sample' },
  { id: 'donor.mapped_metadata.age_value', label: 'Donor Age' },
  { id: 'donor.mapped_metadata.sex', label: 'Donor Sex' },
  { id: 'donor.mapped_metadata.race', label: 'Donor Race' },
  { id: 'descendant_counts.entity_type.Dataset', label: 'Derived Dataset Count' },
  { id: 'last_modified_timestamp', label: 'Last Modified' },
];

function Samples({ organTerms }) {
  const { selectedRows, deselectHeaderAndRows } = useStore();
  const searchUrl = getSearchURL({ entityType: 'Sample', organTerms });
  const query = useMemo(
    () => ({
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
                should: organTerms.map((searchTerm) => ({
                  term: { 'origin_samples.mapped_organ.keyword': searchTerm },
                })),
              },
            },
          ],
        },
      },
      _source: [...columns.map((column) => column.id), 'donor.mapped_metadata.age_unit'],
      size: 10000,
    }),
    [organTerms],
  );

  const { searchHits } = useSearchHits(query);

  return (
    <SectionContainer>
      <SpacedSectionButtonRow
        leftText={
          <div>
            <StyledSectionHeader>Samples</StyledSectionHeader>
            <Typography variant="subtitle1">{searchHits.length} Samples</Typography>
          </div>
        }
        buttons={
          <>
            <Button color="primary" variant="outlined" component="a" href={searchUrl}>
              View Data on Search Page
            </Button>
            <AddItemsToListDialog
              itemsToAddUUIDS={selectedRows}
              onSaveCallback={deselectHeaderAndRows}
              disabled={selectedRows.size === 0}
            />
          </>
        }
      />
      <StyledTableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <SelectableHeaderCell allTableRowKeys={searchHits.map((hit) => hit._id)} />
              {columns.map((column) => (
                <HeaderCell key={column.id}>{column.label}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchHits
              .map((hit) => {
                /* eslint-disable no-underscore-dangle */
                if (!hit._source.donor) {
                  // eslint-disable-next-line no-param-reassign
                  hit._source.donor = {};
                }
                /* eslint-enable */
                return hit;
              })
              .map(({ _id: uuid, _source: { hubmap_id, donor, descendant_counts, last_modified_timestamp } }) => (
                <TableRow key={uuid}>
                  <SelectableRowCell rowKey={uuid} />
                  <TableCell>
                    <InternalLink href={`/browse/sample/${uuid}`} variant="body2">
                      {hubmap_id}
                    </InternalLink>
                  </TableCell>
                  <TableCell>{donor?.mapped_metadata && getDonorAgeString(donor.mapped_metadata)}</TableCell>
                  <TableCell>{donor?.mapped_metadata?.sex}</TableCell>
                  <TableCell>{donor?.mapped_metadata?.race}</TableCell>
                  <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
                  <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </SectionContainer>
  );
}
export default withSelectableTableProvider(Samples, 'organ-samples');
