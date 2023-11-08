import React, { useMemo } from 'react';
import Button from '@mui/material/Button';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { withSelectableTableProvider, useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import AddItemsToListDialog from 'js/components/savedLists/AddItemsToListDialog';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { SampleDocument } from 'js/typings/search';
import {
  datasetDescendants,
  hubmapID,
  lastModifiedTimestamp,
  parentDonorAge,
  parentDonorSex,
  parentDonorRace,
} from 'js/shared-styles/tables/columns';
import { StyledSectionHeader } from './style';
import { getSearchURL } from '../utils';

const columns = [hubmapID, parentDonorAge, parentDonorSex, parentDonorRace, datasetDescendants, lastModifiedTimestamp];

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
      <EntitiesTables<SampleDocument> entities={[{ query, columns, entityType: 'Sample' }]} />
    </SectionContainer>
  );
}
export default withSelectableTableProvider(Samples, 'organ-samples');
