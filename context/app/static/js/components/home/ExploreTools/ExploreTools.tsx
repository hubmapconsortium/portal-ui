import React, { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
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
    src: `${CDN_URL}/v2/explore-tools/workspaces.png`,
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
    src: `${CDN_URL}/v2/explore-tools/vitessce.png`,
    subtitle: 'Explore spatial and single-cell multi-modal datasets with interactive components.',
    checklistItems: ['Scatterplots', 'Heatmaps', 'Spatial Views', 'Genome Browser Tracks', 'Various Statistical Plots'],
  },
  {
    title: 'Explore biomarkers and cell types',
    src: `${CDN_URL}/v2/explore-tools/mcquery.png`,
    subtitle: 'Discover new insights about genes, proteins or cell type related to HuBMAP data.',
    checklistItems: ['Transcriptomic', 'Epigenomic', 'Proteomic', 'Cell Types'],
    ctaText: 'Advanced Query',
    ctaLink: '/cells',
  },
];

export default function ExploreTools() {
  const theme = useTheme();
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
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr 1fr', md: gridTemplateColumns }}
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
        {cards.map(({ title, src, ...card }, index) => (
          <ToolsCard key={title} title={title} src={src} index={index}>
            <ToolDescription {...card} />
          </ToolsCard>
        ))}
      </Grid>
    </CardGridContextProvider>
  );
}
