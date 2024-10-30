import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { Entity } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';

import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useCollectionsDatasets } from './hooks';

interface CollectionDatasetsTableProps {
  datasets: Entity[];
}

function CollectionDatasetsTable({ datasets }: CollectionDatasetsTableProps) {
  const { datasets: data, columns } = useCollectionsDatasets({
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
          // TODO: CLT modal
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          <WhiteBackgroundIconTooltipButton tooltip="Download dataset manifest" onClick={() => {}}>
            <SvgIcon color="primary" component={Download} />
          </WhiteBackgroundIconTooltipButton>
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
