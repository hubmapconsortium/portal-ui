import { Dataset } from 'js/components/types';
import React from 'react';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import { useVitessceConf } from 'js/pages/Dataset/hooks';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import { useOptionalGeneContext } from '../SCFindResults/CurrentGeneContext';
import { SCFindCellTypesChart } from './CellTypesChart';

function SCFindVitesscePreview({ uuid, gene }: Dataset & { gene: string }) {
  const { data: vitessceConf, isLoading } = useVitessceConf(uuid, undefined, gene);

  return (
    <Box p={2} width="100%">
      <Box height="700px">
        <ChartLoader isLoading={isLoading || !vitessceConf}>
          <VisualizationWrapper
            vitData={vitessceConf}
            trackingInfo={{
              action: 'Datasets',
            }}
            isPublicationPage
            uuid={uuid}
            hasNotebook={false}
            shouldDisplayHeader={false}
            hasBeenMounted
            markerGene={gene}
          />
        </ChartLoader>
      </Box>
    </Box>
  );
}

export default function SCFindGeneCharts(dataset: Dataset) {
  const gene = useOptionalGeneContext();
  return (
    <Box py={2}>
      {gene && <SCFindVitesscePreview {...dataset} gene={gene} />}
      <SCFindCellTypesChart {...dataset} />
    </Box>
  );
}
