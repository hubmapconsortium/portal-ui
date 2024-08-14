import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { Entity } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';

import { useCollectionsDatasets } from './hooks';

interface CollectionDatasetsTableProps {
  datasets: Entity[];
}

function CollectionDatasetsTable({ datasets }: CollectionDatasetsTableProps) {
  const { datasets: data, columns } = useCollectionsDatasets({
    ids: datasets.map((d) => d.uuid),
  });

  return (
    <CollapsibleDetailPageSection title="Datasets" id="datasets-table">
      <Typography variant="subtitle1" color="primary">
        {datasets.length} Datasets
      </Typography>
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
