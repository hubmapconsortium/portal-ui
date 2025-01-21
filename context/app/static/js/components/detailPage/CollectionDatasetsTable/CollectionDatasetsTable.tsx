import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import type { Entity } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import BulkDownloadButton from 'js/components/bulkDownload/buttons/BulkDownloadButton';
import SaveEntitiesButton from 'js/components/savedLists/SaveEntitiesButton';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';

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
          <Stack direction="row" spacing={1}>
            <SaveEntitiesButton uuids={uuids} entity_type="Dataset" />
            <BulkDownloadButton uuids={uuids} tooltip="Bulk download files for datasets in this table." />
          </Stack>
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
