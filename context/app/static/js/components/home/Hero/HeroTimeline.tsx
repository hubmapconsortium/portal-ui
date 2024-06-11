import React from 'react';

import Timeline from 'js/shared-styles/Timeline';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { HOME_TIMELINE_ITEMS } from './const';

export default function HeroTimeline() {
  return (
    <Stack>
      <Typography variant="h4" px={2} py={1} zIndex={2} bgcolor="#FBEEEB" position="sticky" top={0}>
        Latest Changes
      </Typography>
      <Timeline data={HOME_TIMELINE_ITEMS} />
    </Stack>
  );
}
