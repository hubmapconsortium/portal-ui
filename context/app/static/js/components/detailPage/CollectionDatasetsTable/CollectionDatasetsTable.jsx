import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';

import { useCollectionsDatasets } from './hooks';

function CollectionDatasetsTable({ datasets }) {
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
