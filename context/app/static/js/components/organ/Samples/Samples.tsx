import React, { useMemo } from 'react';
import Button from '@mui/material/Button';

import { withSelectableTableProvider, useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import AddItemsToListDialog from 'js/components/savedLists/AddItemsToListDialog';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { SampleDocument } from 'js/typings/search';
import {
  datasetDescendants,
  hubmapID,
  createdTimestamp,
  parentDonorAge,
  parentDonorSex,
  parentDonorRace,
} from 'js/shared-styles/tables/columns';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { getSearchURL } from '../utils';

const columns = [hubmapID, parentDonorAge, parentDonorSex, parentDonorRace, datasetDescendants, createdTimestamp];

interface OrganSamplesProps {
  organTerms: string[];
  id: string;
}

function Samples({ organTerms, id }: OrganSamplesProps) {
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
    <CollapsibleDetailPageSection
      id={id}
      title="Samples"
      action={
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
    >
      <EntitiesTables<SampleDocument> entities={[{ query, columns, entityType: 'Sample' }]} />
    </CollapsibleDetailPageSection>
  );
}

export default withSelectableTableProvider(Samples, 'organ-samples');
