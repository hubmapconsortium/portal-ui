import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import React from 'react';
import { CellPopHuBMAPLoader } from 'cellpop';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutlinedButton from 'js/shared-styles/buttons/OutlinedButton';
import { CellTypeIcon, DatasetIcon } from 'js/shared-styles/icons';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {
  bodyExpandedCSS,
  ExpandableDiv,
  ExpandButton,
} from 'js/components/detailPage/visualization/Visualization/style';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import VisualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import theme, { darkTheme } from 'js/theme/theme';

interface CellPopulationPlotProps {
  id: string;
  uuids: string[];
}

function visualizationSelector(store: VisualizationStore) {
  return {
    fullscreenVizId: store.fullscreenVizId,
    theme: store.vizTheme,
    expandViz: store.expandViz,
  };
}

function CellPopulationPlot({ id, uuids }: CellPopulationPlotProps) {
  const { fullscreenVizId, theme: vizTheme, expandViz } = useVisualizationStore(visualizationSelector);
  const vizIsFullscreen = fullscreenVizId === id;
  return (
    <CollapsibleDetailPageSection title="Cell Population Plot" id={id} icon={CellTypeIcon}>
      <SectionDescription
        addendum={[
          <LabelledSectionText label="Basic Exploration" key="basic-exploration">
            Hover over any items in the plot to reveal additional information about the data. Toggle to select either
            columns or rows to adjust the plot as needed. Toggle between bar charts and violin plots to display either
            the total count of cells or their fractional distributions.
          </LabelledSectionText>,
          <LabelledSectionText label="Plot Controls" key="plot-controls">
            Use the plot controls to modify sorting preferences or display options. Display options include toggling the
            visibility of a specific column or row, or embedding a bar chart to compare the amounts of cell types within
            a dataset.
          </LabelledSectionText>,
          <LabelledSectionText label="Relevant Pages" key="relevant-pages">
            <OutlinedButton color="info">Tutorial</OutlinedButton>
          </LabelledSectionText>,
        ]}
      >
        This interactive heatmap visualizes cell populations in datasets from this organ. Cell type annotations are from
        Azimuth. Key features are highlighted below and a tutorial is available.
      </SectionDescription>
      <SpacedSectionButtonRow
        buttons={
          <Stack direction="row" spacing={1}>
            <VisualizationThemeSwitch />
            <SecondaryBackgroundTooltip title="Switch to Fullscreen">
              <ExpandButton
                size="small"
                onClick={() => {
                  expandViz(id);
                }}
                variant="contained"
              >
                <FullscreenRoundedIcon color="primary" />
              </ExpandButton>
            </SecondaryBackgroundTooltip>
          </Stack>
        }
      />
      <Paper>
        <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={vizTheme} $nonExpandedHeight={1000}>
          <CellPopHuBMAPLoader
            uuids={uuids}
            theme={vizTheme}
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
            customTheme={vizTheme === 'dark' ? darkTheme : theme}
            disabledControls={['theme']}
          />
          <style type="text/css">{vizIsFullscreen && bodyExpandedCSS}</style>
        </ExpandableDiv>
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CellPopulationPlot);
