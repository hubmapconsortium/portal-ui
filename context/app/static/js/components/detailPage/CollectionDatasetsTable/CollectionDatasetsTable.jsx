import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import {
  lastModifiedTimestampCol,
  organCol,
  dataTypesCol,
  statusCol,
} from 'js/components/detailPage/derivedEntities/columns';
import { useCollectionsDatasets } from './hooks';

const columns = [
  organCol,
  dataTypesCol,
  lastModifiedTimestampCol,
  {
    id: 'created_by_user_displayname',
    label: 'Contact',
    renderColumnCell: ({ created_by_user_displayname }) => created_by_user_displayname,
  },
  statusCol,
];
function CollectionDatasetsTable({ datasets }) {
  const data = useCollectionsDatasets({
    ids: datasets.map((d) => d.uuid),
    sourceFields: ['hubmap_id', 'entity_type', ...columns.map((c) => c.id)],
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
