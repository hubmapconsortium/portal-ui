import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { trackEvent } from 'js/helpers/trackers';
import HeroBackground from './HeroBackground';
import HeroCard from './HeroCard';
import HeroBottomBar from './HeroBottomBar';
import { HERO_CARDS } from './const';
import { HeroSection, HeroContentContainer } from './styles';

function HeroLeftColumn() {
  return (
    <Stack spacing={3} justifyContent="start" maxWidth={{ lg: 450 }}>
      <Typography variant="subtitle1" color="primary">
        Human BioMolecular Atlas Program Data Portal
      </Typography>
      <Typography variant="h1" component="h1" data-testid="home-page-title" fontWeight={300}>
        Explore Healthy Human Single-Cell and Spatial Data
      </Typography>
      <Typography variant="h4" component="p" color="text.secondary">
        An open-source platform to discover standardized organ, cell type, gene, and tissue data across the human body.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          href="/search/datasets"
          onClick={() => {
            trackEvent({ category: 'Homepage', action: 'Hero', label: 'Explore All Datasets Button' });
          }}
        >
          Explore All Datasets
        </Button>
        <Button
          variant="outlined"
          // Can't make it white without !important due to MUI specificity, but it doesn't cause any issues in this case since it's only used here and we want it to be white.
          // The !important also suppresses the default outlined hover tint, so restore a
          // hover state (grey[100], matching the theme's `elevated` variant on white).
          sx={(theme) => ({
            backgroundColor: 'white !important',
            '&:hover': { backgroundColor: `${theme.palette.grey[100]} !important` },
          })}
          href="/workspaces"
          onClick={() => {
            trackEvent({ category: 'Homepage', action: 'Hero', label: 'Launch Workspaces Button' });
          }}
        >
          Launch Workspaces
        </Button>
      </Stack>
    </Stack>
  );
}

interface HeroRightColumnProps {
  onCardHover?: (index: number) => void;
  onCardHoverEnd?: () => void;
}

function HeroRightColumn({ onCardHover, onCardHoverEnd }: HeroRightColumnProps) {
  return (
    <Stack spacing={2} justifyContent="center" maxWidth={{ lg: 420 }} ml="auto">
      {HERO_CARDS.map((card, index) => (
        <HeroCard key={card.title} {...card} onCardHover={() => onCardHover?.(index)} onCardHoverEnd={onCardHoverEnd} />
      ))}
    </Stack>
  );
}

export default function Hero() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <HeroSection aria-label="HuBMAP Data Portal Introduction">
        <HeroBackground hoveredIndex={hoveredIndex} />
        <HeroContentContainer maxWidth="lg">
          <HeroLeftColumn />
          <HeroRightColumn onCardHover={setHoveredIndex} onCardHoverEnd={() => setHoveredIndex(null)} />
        </HeroContentContainer>
      </HeroSection>
      {/* Sibling of HeroSection (not nested) so its sticky positioning is bounded by the
          page root, not the short hero — otherwise it un-sticks and hides behind the top bar */}
      <HeroBottomBar />
    </>
  );
}
