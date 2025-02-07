import React, { useMemo } from 'react';
import Button from '@mui/material/Button';
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
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { getSearchURL } from '../utils';

const columns = [hubmapID, parentDonorAge, parentDonorSex, parentDonorRace, datasetDescendants, createdTimestamp];

interface OrganSamplesProps {
  organTerms: string[];
  id: string;
}

function Samples({ organTerms, id }: OrganSamplesProps) {
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
        <Stack direction="row" spacing={1}>
          <Button color="primary" variant="outlined" component="a" href={searchUrl}>
            View Data on Search Page
          </Button>
          <SaveEntitiesButtonFromSearch entity_type="Sample" />
        </Stack>
      }
    >
      <EntitiesTables<SampleDocument> entities={[{ query, columns, entityType: 'Sample' }]} />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(withSelectableTableProvider(Samples, 'organ-samples'));
