import withShouldDisplay from 'js/helpers/withShouldDisplay';
import React from 'react';
import { CellPopHuBMAPLoader } from 'cellpop';
import { CellTypeIcon, DatasetIcon } from 'js/shared-styles/icons';
import Paper from '@mui/material/Paper';
import { ExpandableDiv } from 'js/components/detailPage/visualization/Visualization/style';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import lightTheme, { darkTheme } from 'js/theme/theme';
import BodyExpandedCSS from 'js/components/detailPage/visualization/BodyExpandedCSS';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import { OrganPageIds } from 'js/components/organ/types';
import CellPopDescription from './CellPopDescription';
import CellPopActions from './CellPopActions';
import { useTrackCellpop } from './hooks';

interface CellPopulationPlotProps {
  uuids: string[];
}

function visualizationSelector(store: VisualizationStore) {
  return {
    fullscreenVizId: store.fullscreenVizId,
    theme: store.vizTheme,
  };
}

const { cellpopId } = OrganPageIds;

function CellPopulationPlot({ uuids }: CellPopulationPlotProps) {
  const { fullscreenVizId, theme } = useVisualizationStore(visualizationSelector);
  const vizIsFullscreen = fullscreenVizId === cellpopId;

  const trackEvent = useTrackCellpop();

  return (
    <OrganDetailSection title="Cell Population Plot" id={cellpopId} icon={CellTypeIcon}>
      <CellPopDescription />
      <CellPopActions id={cellpopId} />
      <Paper>
        <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={theme} $nonExpandedHeight={1000}>
          <CellPopHuBMAPLoader
            uuids={uuids}
            theme={theme}
            yAxis={{
              label: 'Dataset',
              createHref: (row) => `https://portal.hubmapconsortium.org/browse/${row}`,
              flipAxisPosition: true,
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
              flipAxisPosition: true,
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
