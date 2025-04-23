import React, { useMemo } from 'react';
import Stack from '@mui/material/Stack';

import SaveEntitiesButtonFromSearch from 'js/components/savedLists/SaveEntitiesButtonFromSearch';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
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
import ViewEntitiesButton from 'js/components/organ/ViewEntitiesButton';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { OrganPageIds } from 'js/components/organ/types';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import { useOrganContext } from 'js/components/organ/contexts';

const columns = [hubmapID, parentDonorAge, parentDonorSex, parentDonorRace, datasetDescendants, createdTimestamp];

interface OrganSamplesProps {
  organTerms: string[];
}

function Samples({ organTerms }: OrganSamplesProps) {
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

  const {
    organ: { name },
  } = useOrganContext();

  return (
    <OrganDetailSection
      id={OrganPageIds.samplesId}
      title="Samples"
      action={
        <Stack direction="row" spacing={1}>
          <ViewEntitiesButton
            entityType="Sample"
            filters={{ organTerms }}
            trackingInfo={{ action: 'Samples', label: name }}
          />
          <SaveEntitiesButtonFromSearch entity_type="Sample" />
        </Stack>
      }
    >
      <EntitiesTables<SampleDocument>
        entities={[{ query, columns, entityType: 'Sample' }]}
        trackingInfo={{ category: 'Organ Page', action: 'Samples', label: name }}
      />
    </OrganDetailSection>
  );
}

export default withShouldDisplay(withSelectableTableProvider(Samples, 'organ-samples'));
