import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';

import type { Entity } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { buildSearchLink } from 'js/components/search/store';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';

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
    <CollapsibleDetailPageSection
      title="Datasets"
      id="datasets-table"
      icon={sectionIconMap.datasets}
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
    >
      <SectionDescription>This is the list of data that is in this collection.</SectionDescription>
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
