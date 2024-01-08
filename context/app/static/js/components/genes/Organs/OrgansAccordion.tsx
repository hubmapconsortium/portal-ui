import React from 'react';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { useGeneOrgans } from '../hooks';
import { AzimuthVisualization } from './Visualization';

export default function GeneOrgans() {
  const { data } = useGeneOrgans();
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <Stack direction="row" gap={4} py={1}>
      {Object.entries(data).map(([organ, organData]) => {
        return (
          <Accordion square key={organ}>
            <AccordionSummary>{organ}</AccordionSummary>
            <AccordionDetails>
              <AzimuthVisualization organ={organData} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
