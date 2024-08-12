import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import type { Entity } from 'js/components/types';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';
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
    <DetailPageSection id="datasets-table">
      <SectionHeader>Datasets</SectionHeader>
      <Typography variant="subtitle1" color="primary">
        {datasets.length} Datasets
      </Typography>
      <Paper>
        <RelatedEntitiesTable columns={columns} entities={data} entityType="dataset" />
      </Paper>
    </DetailPageSection>
  );
}

CollectionDatasetsTable.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CollectionDatasetsTable;
