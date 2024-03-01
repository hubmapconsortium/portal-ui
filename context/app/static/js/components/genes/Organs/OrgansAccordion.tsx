import React from 'react';
import Stack from '@mui/material/Stack';

import Accordion from '@mui/material/Accordion';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import PrimaryColorAccordionSummary from 'js/shared-styles/accordions/PrimaryColorAccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import Skeleton from '@mui/material/Skeleton';
import { BarChartRounded } from '@mui/icons-material';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useGeneEntities } from '../hooks';
import { AzimuthVisualization } from './Visualization';

function LoadingSkeleton() {
  return (
    <Stack direction="column" gap={0}>
      {Array.from({ length: 3 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography variant="subtitle1" key={i}>
          <Skeleton width="100%" />
        </Typography>
      ))}
    </Stack>
  );
}

const availableVisualizationTooltip = 'Azimuth reference-based analysis visualization available';

export default function GeneOrgansAccordion() {
  const { data, isLoading } = useGeneEntities();
  const [selectedOrgan, setSelectedOrgan] = React.useState<string | null>(null);
  if (!data || isLoading) {
    return <LoadingSkeleton />;
  }

  // TODO: Design a better way to handle this case
  if (!data.organs) {
    return 'No organs found.';
  }

  return (
    <Stack direction="column" gap={0}>
      {Object.entries(data.organs).map(([organ, organData]) => {
        const isSelected = selectedOrgan === organ;
        return (
          <Accordion
            key={organ}
            square
            expanded={isSelected}
            onChange={() => setSelectedOrgan((prev) => (prev === organ ? null : organ))}
            TransitionProps={{ mountOnEnter: true }}
          >
            <PrimaryColorAccordionSummary $isExpanded={isSelected} expandIcon={<ArrowDropUpRoundedIcon />}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" flexGrow={1}>
                <Stack direction="row" gap={1} alignItems="center">
                  <URLSvgIcon iconURL={organData.icon} ariaLabel={organ} invertColors={isSelected} />
                  <Typography variant="subtitle1">{organ}</Typography>
                  {organData.azimuth && (
                    <SecondaryBackgroundTooltip title={availableVisualizationTooltip}>
                      <BarChartRounded aria-label={availableVisualizationTooltip} />
                    </SecondaryBackgroundTooltip>
                  )}
                </Stack>
                <Typography
                  variant="body1"
                  sx={{
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {organData.uberon_short}
                </Typography>
              </Stack>
            </PrimaryColorAccordionSummary>
            <AccordionDetails>
              <AzimuthVisualization organ={organData} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
