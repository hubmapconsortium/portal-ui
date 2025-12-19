import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { CollapsibleDetailPageSection } from '../DetailPageSection';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import { Dataset } from 'js/components/types';
import { assayTypes, hubmapID, status, organCol } from 'js/shared-styles/tables/columns';

interface IntegratedDatasetsProps {
  datasets: string[];
}

function IntegratedDatasets({ datasets }: IntegratedDatasetsProps) {
  return (
    <CollapsibleDetailPageSection id="integrated-datasets" title="Integrated Data">
      <EntityTable<Dataset>
        isSelectable={false}
        query={{
          query: {
            bool: {
              must: {
                ids: {
                  values: datasets,
                },
              },
            },
          },
          size: 10000,
          _source: [
            'hubmap_id',
            'origin_samples_unique_mapped_organs',
            'mapped_status',
            'mapped_data_types',
            'mapped_data_access_level',
            'uuid',
            'last_modified_timestamp',
            'donor',
            'entity_type',
          ],
        }}
        columns={[hubmapID, assayTypes, status, organCol]}
      />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(IntegratedDatasets);
