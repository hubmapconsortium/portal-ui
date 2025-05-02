import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { Entity } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { buildSearchLink } from 'js/components/search/store';

import { useCollectionsDatasets } from './hooks';

interface CollectionDatasetsTableProps {
  datasets: Entity[];
}

function CollectionDatasetsTable({ datasets }: CollectionDatasetsTableProps) {
  const {
    datasets: data,
    columns,
    uuids,
  } = useCollectionsDatasets({
    ids: datasets.map((d) => d.uuid),
  });

  return (
    <CollapsibleDetailPageSection title="Datasets" id="datasets-table" icon={sectionIconMap.datasets}>
      <SpacedSectionButtonRow
        leftText={
          <Typography variant="subtitle1" color="primary">
            {datasets.length} Datasets
          </Typography>
        }
        buttons={
          <RelatedEntitiesSectionActions
            searchPageHref={buildSearchLink({
              entity_type: 'Dataset',
              filters: {
                uuid: {
                  type: 'TERM',
                  values: Array.from(uuids),
                },
              },
            })}
            uuids={uuids}
          />
        }
      />
      <Paper>
        <RelatedEntitiesTable columns={columns} entities={data} entityType="dataset" />
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

CollectionDatasetsTable.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CollectionDatasetsTable;
