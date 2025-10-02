import { Dataset } from 'js/components/types';
import React, { useMemo } from 'react';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import { useVitessceConf } from 'js/pages/Dataset/hooks';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import { useOptionalGeneContext } from '../SCFindResults/CurrentGeneContext';
import { SCFindCellTypesChart } from './CellTypesChart';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMultiGeneHyperQueryCellTypes } from 'js/api/scfind/useHyperQueryCellTypes';
import { useChartPalette } from 'js/shared-styles/charts/HorizontalStackedBarChart/hooks';

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
  const genesToQuery = useMemo(() => (gene ? [gene] : allGenes), [gene, allGenes]);

  // Extract organ name for hyperquery, remove laterality
  const organName = dataset.origin_samples_unique_mapped_organs?.[0].split(' (')[0];

  const chartColors = useChartPalette();

  // Fetch relevant cell types for each gene separately
  const { geneResults, isLoading: hyperQueryLoading } = useMultiGeneHyperQueryCellTypes({
    genes: genesToQuery,
    organName,
  });

  // Process results to create gene highlights and cell type associations
  const { geneHighlights, cellTypeGeneAssociations } = useMemo(() => {
    const highlights: Array<{ gene: string; color: string; cellTypes: string[] }> = [];
    const associations: Array<{ cellType: string; genes: string[]; colors: string[] }> = [];

    // Map to track which cell types are associated with which genes
    const cellTypeToGenesMap = new Map<string, { genes: string[]; colors: string[] }>();

    genesToQuery.forEach((geneName, index) => {
      const signatures = geneResults[geneName] || [];
      const significantSignatures = signatures.filter((sig) => sig.pval < 0.05);

      if (significantSignatures.length > 0) {
        const geneColor = chartColors[index % chartColors.length];
        const cellTypes = significantSignatures.map((sig) => sig.cell_type.split('.')[1]).filter(Boolean);

        // Add to single gene highlights
        highlights.push({
          gene: geneName,
          color: geneColor,
          cellTypes,
        });

        // Track cell type associations
        cellTypes.forEach((cellType) => {
          if (!cellTypeToGenesMap.has(cellType)) {
            cellTypeToGenesMap.set(cellType, { genes: [], colors: [] });
          }
          const association = cellTypeToGenesMap.get(cellType)!;
          if (!association.genes.includes(geneName)) {
            association.genes.push(geneName);
            association.colors.push(geneColor);
          }
        });
      }
    });

    // Convert cell type associations to the required format
    cellTypeToGenesMap.forEach((association, cellType) => {
      associations.push({
        cellType,
        genes: association.genes,
        colors: association.colors,
      });
    });

    return { geneHighlights: highlights, cellTypeGeneAssociations: associations };
  }, [geneResults, genesToQuery, chartColors]);

  return (
    <Box py={2}>
      {gene && <SCFindVitesscePreview {...dataset} gene={gene} />}
      <SCFindCellTypesChart
        {...dataset}
        geneHighlights={geneHighlights}
        cellTypeGeneAssociations={cellTypeGeneAssociations}
        hyperQueryLoading={hyperQueryLoading}
        currentGene={gene}
        queriedGenes={allGenes}
      />
    </Box>
  );
}
