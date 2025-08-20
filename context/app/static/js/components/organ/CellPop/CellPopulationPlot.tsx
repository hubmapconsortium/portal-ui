import withShouldDisplay from 'js/helpers/withShouldDisplay';
import React, { ComponentProps, useMemo } from 'react';
import { CellPop } from 'cellpop';
import { CellTypeIcon, DatasetIcon } from 'js/shared-styles/icons';
import Paper from '@mui/material/Paper';
import { ExpandableDiv } from 'js/components/detailPage/visualization/Visualization/style';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import lightTheme, { darkTheme } from 'js/theme/theme';
import BodyExpandedCSS from 'js/components/detailPage/visualization/BodyExpandedCSS';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import { OrganPageIds } from 'js/components/organ/types';
import { useCellTypeCountForDatasets } from 'js/api/scfind/useCellTypeCountForDataset';
import { formatCellTypeName } from 'js/api/scfind/utils';
import CellPopDescription from './CellPopDescription';
import CellPopActions from './CellPopActions';
import { useTrackCellpop } from './hooks';

interface CellPopulationPlotProps {
  uuids: string[];
  organ: string;
}

function visualizationSelector(store: VisualizationStore) {
  return {
    fullscreenVizId: store.fullscreenVizId,
    theme: store.vizTheme,
  };
}

const { cellpopId } = OrganPageIds;

type CellPopData = ComponentProps<typeof CellPop>['data'];

const useCellPopData = (datasets: string[] | undefined = []): CellPopData => {
  const { data } = useCellTypeCountForDatasets({ datasets });

  // Format data for CellPop component
  const formattedData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return undefined;
    }

    // Row names are the dataset UUIDs (keys of the data object)
    const rowNames = Object.keys(data);

    // Column names are all unique cell type indices across all datasets
    const allCellTypes = new Set<string>();
    Object.values(data).forEach((cellTypeCounts) => {
      cellTypeCounts.forEach((cellType) => {
        allCellTypes.add(formatCellTypeName(cellType.index));
      });
    });
    const colNames = Array.from(allCellTypes);

    // Counts matrix: array of [dataset UUID, cell type index, count] tuples
    const countsMatrix: [string, string, number][] = [];

    // For each dataset, add entries for all cell types (including zeros for missing ones)
    Object.entries(data).forEach(([datasetUuid, cellTypeCounts]) => {
      // Create a map of existing cell types for this dataset
      const existingCellTypes = new Map<string, number>();
      cellTypeCounts.forEach(({ index, count }) => {
        existingCellTypes.set(formatCellTypeName(index), count);
      });

      // Add entries for all cell types (existing + missing with zero counts)
      colNames.forEach((cellTypeName) => {
        const count = existingCellTypes.get(cellTypeName) ?? 0;
        countsMatrix.push([datasetUuid, cellTypeName, count]);
      });
    });

    return {
      rowNames,
      colNames,
      countsMatrixOrder: ['row', 'col', 'value'],
      countsMatrix,
      metadata: {}, // Empty object for now, will be filled in later
    };
  }, [data]);

  return formattedData;
};

function CellPopulationPlot({ uuids, organ }: CellPopulationPlotProps) {
  const { fullscreenVizId, theme } = useVisualizationStore(visualizationSelector);
  const vizIsFullscreen = fullscreenVizId === cellpopId;

  const trackEvent = useTrackCellpop();

  const data = useCellPopData(uuids);

  if (!data) return null;

  return (
    <OrganDetailSection title="Cell Population Plot" id={cellpopId} icon={CellTypeIcon}>
      <CellPopDescription organ={organ} />
      <CellPopActions id={cellpopId} />
      <Paper>
        <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={theme} $nonExpandedHeight={1000}>
          <CellPop
            data={data}
            theme={theme}
            yAxis={{
              label: 'Dataset',
              createHref: (row) => `https://portal.hubmapconsortium.org/browse/${row}`,
              createSubtitle: (_, metadataValues) => {
                const assay = metadataValues?.assay;
                const anatomy = metadataValues?.anatomy ?? 'Unknown';
                return `${anatomy} | ${assay}`;
              },
              icon: <DatasetIcon />,
            }}
            tooltipFields={['Cell Ontology Label']}
            xAxis={{
              label: 'Cell Type',
              createHref: (col) => `https://www.ebi.ac.uk/ols4/search?q=${col}&ontology=cl`,
              createSubtitle: (_, metadataValues) => {
                if (metadataValues && 'Cell Ontology Label' in metadataValues) {
                  return metadataValues['Cell Ontology Label'] as string;
                }
                return '';
              },
              icon: <CellTypeIcon />,
            }}
            initialProportions={[
              [0.4, 0.5, 0.1],
              [0.3, 0.6, 0.1],
            ]}
            customTheme={theme === 'dark' ? darkTheme : lightTheme}
            disabledControls={['theme']}
            trackEvent={trackEvent}
          />
          <BodyExpandedCSS id={cellpopId} />
        </ExpandableDiv>
      </Paper>
    </OrganDetailSection>
  );
}

export default withShouldDisplay(CellPopulationPlot);
