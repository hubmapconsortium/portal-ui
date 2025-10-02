import { Dataset } from 'js/components/types';
import React from 'react';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import { useVitessceConf } from 'js/pages/Dataset/hooks';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import { useOptionalGeneContext } from '../SCFindResults/CurrentGeneContext';
import { SCFindCellTypesChart } from './CellTypesChart';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import useHyperQueryCellTypes from 'js/api/scfind/useHyperQueryCellTypes';

function SCFindVitesscePreview({ uuid, gene }: Dataset & { gene: string }) {
  const { data: vitessceConf, isLoading } = useVitessceConf(uuid, undefined, gene, true);

  return (
    <Box p={2} width="100%" height="700px">
      <ChartLoader isLoading={isLoading || !vitessceConf}>
        <VisualizationWrapper
          vitData={vitessceConf}
          trackingInfo={{
            action: 'Datasets',
          }}
          uuid={uuid}
          hasNotebook={false}
          hasBeenMounted
          markerGene={gene}
          hideTheme
          hideShare
          title={`${gene} Expression Preview`}
        />
      </ChartLoader>
    </Box>
  );
}

export default function SCFindGeneCharts(dataset: Dataset) {
  const gene = useOptionalGeneContext();
  const allGenes = useCellVariableNames();

  // For individual gene context, use only that gene; otherwise use all queried genes
  const genesToQuery = gene ? [gene] : allGenes;

  // Extract organ name for hyperquery, remove laterality
  const organName = dataset.origin_samples_unique_mapped_organs?.[0].split(' (')[0];

  // Fetch relevant cell types for the current genes
  const { data: hyperQueryData, isLoading: hyperQueryLoading } = useHyperQueryCellTypes({
    geneList: genesToQuery,
    organName,
  });

  return (
    <Box py={2}>
      {gene && <SCFindVitesscePreview {...dataset} gene={gene} />}
      <SCFindCellTypesChart
        {...dataset}
        hyperQueryData={hyperQueryData}
        hyperQueryLoading={hyperQueryLoading}
        currentGene={gene}
        queriedGenes={allGenes}
      />
    </Box>
  );
}
