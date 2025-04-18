import React, { useMemo } from 'react';
import Stack from '@mui/material/Stack';

import SaveEntitiesButtonFromSearch from 'js/components/savedLists/SaveEntitiesButtonFromSearch';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import {
  datasetDescendants,
  hubmapID,
  createdTimestamp,
  parentDonorAge,
  parentDonorSex,
  parentDonorRace,
} from 'js/shared-styles/tables/columns';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import ViewEntitiesButton from 'js/components/organ/ViewEntitiesButton';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { Sample } from 'js/components/types';

const columns = [hubmapID, parentDonorAge, parentDonorSex, parentDonorRace, datasetDescendants, createdTimestamp];

interface OrganSamplesProps {
  organTerms: string[];
  id: string;
}

function Samples({ organTerms, id }: OrganSamplesProps) {
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
        <Stack direction="row" spacing={1}>
          <ViewEntitiesButton entityType="Sample" filters={{ organTerms }} />
          <SaveEntitiesButtonFromSearch entity_type="Sample" />
        </Stack>
      }
    >
      <EntitiesTables<Sample> entities={[{ query, columns, entityType: 'Sample' }]} />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(withSelectableTableProvider(Samples, 'organ-samples'));
