import React, { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import theme from 'js/theme/theme';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { ToolsCard } from './ToolsCard';
import { CardGridContextProvider } from './CardGridContext';
import { ToolDescription } from './ToolDescription';
import { makeGridTemplateColumns } from './utils';

const workspaceCTAAuthenticated = {
  ctaText: 'View Your Workspaces',
  ctaLink: '/workspaces',
  ctaIcon: <entityIconMap.Workspace />,
};

const workspaceCTAGuest = {
  ctaText: 'Sign in',
  ctaLink: '/login',
};

const cards = [
  {
    title: 'Analyze data in Workspaces',
    icon: <entityIconMap.Workspace color="info" fontSize="1.5rem" />,
    src: `${CDN_URL}/v2/explore-tools/tools_workspaces.png`,
    alt: 'A screenshot of a remote Jupyter and RStudio environment.',
    subtitle: 'Load datasets into an interactive JupyterLab Python and R analysis environment.',
    checklistItems: [
      'No need to download data.',
      'Use the provided code templates to get started with HuBMAP data.',
      'The Workspaces feature is available once you sign in.',
    ],
    ...(isAuthenticated ? workspaceCTAAuthenticated : workspaceCTAGuest),
  },
  {
    title: 'Visualize data in Vitessce',
    icon: <VisualizationIcon color="error" fontSize="1.5rem" />,
    src: `${CDN_URL}/v2/explore-tools/tools_vitessce.png`,
    alt: 'A screenshot of a Vitessce visualization with a scatterplot, spatial view, and heatmap.',
    subtitle: 'Explore spatial and single-cell multi-modal datasets with interactive components.',
    checklistItems: ['Scatterplots', 'Heatmaps', 'Spatial Views', 'Genome Browser Tracks', 'Various Statistical Plots'],
  },
  {
    title: 'Explore biomarkers & cell types',
    icon: <entityIconMap.Gene color="success" fontSize="1.5rem" />,
    src: `${CDN_URL}/v2/explore-tools/tools_mcquery.png`,
    alt: 'A screenshot of the results of a lookup for cells that match a specific gene expression pattern.',
    subtitle: 'Discover new insights about genes, proteins or cell type related to HuBMAP data.',
    checklistItems: ['Transcriptomic', 'Epigenomic', 'Proteomic', 'Cell Types'],
    ctaText: 'Advanced Query',
    ctaLink: '/cells',
  },
];

export default function ExploreTools() {
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

  const gridTemplateColumns = makeGridTemplateColumns(cards, expandedCardIndex);

  const resetExpandedCardIndex = () => setExpandedCardIndex(null);
  return (
    <CardGridContextProvider
      expandedCardIndex={expandedCardIndex}
      setExpandedCardIndex={setExpandedCardIndex}
      cardCount={cards.length}
    >
      <Grid
        display="grid"
        spacing={2}
        columnGap={2}
        rowGap={2}
        gridTemplateColumns={{ xs: '1fr', md: gridTemplateColumns }}
        style={{
          transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.shortest,
          }),
        }}
        onMouseLeave={resetExpandedCardIndex}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) resetExpandedCardIndex();
        }}
      >
        {cards.map(({ title, icon, src, alt, ...card }, index) => (
          <ToolsCard key={title} title={title} icon={icon} alt={alt} src={src} index={index}>
            <ToolDescription {...card} />
          </ToolsCard>
        ))}
      </Grid>
    </CardGridContextProvider>
  );
}
