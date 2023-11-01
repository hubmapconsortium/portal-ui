/* eslint-disable no-underscore-dangle */
import React, { useMemo } from 'react';
import format from 'date-fns/format';
import Button from '@mui/material/Button';

import { InternalLink } from 'js/shared-styles/Links';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { withSelectableTableProvider, useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import AddItemsToListDialog from 'js/components/savedLists/AddItemsToListDialog';
import { getDonorAgeString } from 'js/helpers/functions';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { SampleDocument } from 'js/typings/search';
import { StyledSectionHeader } from './style';
import { getSearchURL } from '../utils';

interface CellContentProps {
  hit: SampleDocument;
}

const columns = [
  {
    id: 'hubmap_id',
    label: 'Sample',
    sort: 'hubmap_id.keyword',
    cellContent: ({ hit: { uuid, hubmap_id } }: CellContentProps) => (
      <InternalLink href={`/browse/sample/${uuid}`} variant="body2">
        {hubmap_id}
      </InternalLink>
    ),
  },
  {
    id: 'donor.mapped_metadata.age_value',
    label: 'Donor Age',
    cellContent: ({ hit: { donor } }: CellContentProps) =>
      donor?.mapped_metadata && getDonorAgeString(donor.mapped_metadata),
  },
  {
    id: 'donor.mapped_metadata.sex',
    label: 'Donor Sex',
    sort: 'donor.mapped_metadata.sex.keyword',
    cellContent: ({ hit: { donor } }: CellContentProps) => donor?.mapped_metadata?.sex,
  },

  {
    id: 'donor.mapped_metadata.race',
    label: 'Donor Race',
    sort: 'donor.mapped_metadata.race.keyword',
    cellContent: ({ hit: { donor } }: CellContentProps) => donor?.mapped_metadata?.race,
  },
  {
    id: 'descendant_counts.entity_type.Dataset',
    label: 'Derived Dataset Count',
    cellContent: ({ hit: { descendant_counts } }: CellContentProps) => descendant_counts?.entity_type?.Dataset ?? 0,
  },
  {
    id: 'last_modified_timestamp',
    label: 'Last Modified',
    cellContent: ({ hit: { last_modified_timestamp } }: CellContentProps) =>
      format(last_modified_timestamp, 'yyyy-MM-dd'),
  },
];

interface OrganSamplesProps {
  organTerms: string[];
}

function Samples({ organTerms }: OrganSamplesProps) {
  const { selectedRows, deselectHeaderAndRows } = useSelectableTableStore();
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
      _source: [...columns.map((column) => column.id), 'uuid', 'donor.mapped_metadata.age_unit'],
      size: 500,
    }),
    [organTerms],
  );

  return (
    <SectionContainer>
      <SpacedSectionButtonRow
        leftText={
          <div>
            <StyledSectionHeader>Samples</StyledSectionHeader>
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
      <EntitiesTables<SampleDocument> entities={[{ query, columns, tabLabel: 'Samples' }]} />
    </SectionContainer>
  );
}
export default withSelectableTableProvider(Samples, 'organ-samples');
