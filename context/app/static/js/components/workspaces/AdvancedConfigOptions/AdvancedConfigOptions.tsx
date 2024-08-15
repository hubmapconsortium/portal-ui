import React, { useMemo } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import { Button, Slider, Typography } from '@mui/material';
import Stack from '@mui/system/Stack';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledAccordion, StyledHeader, StyledSubtitle, StyledSwitch, StyledSwitchLabel } from './style';

interface ConfigSliderProps {
  label: string;
  tooltip: string;
  defaultValue: number;
  min: number;
  max: number;
}

const description =
  'Adjusting these settings may result in longer workspace load times and could potentially affect your saved work.';
const configSliderOptions: ConfigSliderProps[] = [
  {
    label: 'Time Limit (hours)',
    tooltip: 'Session duration for your workspace.',
    defaultValue: 3,
    min: 1,
    max: 6,
  },
  {
    label: 'Memory (GB)',
    tooltip: 'Available memory for your workspace.',
    defaultValue: 8,
    min: 1,
    max: 16,
  },
  {
    label: 'Number of CPUs',
    tooltip: 'Number of CPUs available for your workspace.',
    defaultValue: 1,
    min: 1,
    max: 2,
  },
];

function ConfigSlider({ label, tooltip, defaultValue, min, max }: ConfigSliderProps) {
  const marks = useMemo(() => {
    const tempMarks = [];
    for (let i = min; i <= max; i += 1) {
      tempMarks.push({ value: i, label: i });
    }
    return tempMarks;
  }, [min, max]);

  return (
    <Stack marginTop={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledSubtitle>{label}</StyledSubtitle>
        <InfoTooltipIcon iconTooltipText={tooltip} />
      </Stack>
      <Stack padding={1}>
        <Slider defaultValue={defaultValue} valueLabelDisplay="auto" marks={marks} min={min} max={max} />
      </Stack>
    </Stack>
  );
}

function AdvancedConfigOptions() {
  return (
    <StyledAccordion>
      <AccordionSummary expandIcon={<ArrowDropDownRounded color="primary" />}>
        <StyledHeader fontSize="5rem">Advanced Configurations (Optional)</StyledHeader>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          <Typography>{description}</Typography>
          <SpacedSectionButtonRow
            buttons={
              <Stack direction="row" gap={1} marginTop={1}>
                <Button type="button" variant="contained" disabled>
                  Restore Defaults
                </Button>
              </Stack>
            }
          />
          {configSliderOptions.map((props) => (
            <ConfigSlider key={props.label} {...props} />
          ))}
          <StyledSubtitle>Enable GPU</StyledSubtitle>
          <Stack direction="row" component="label" alignItems="center">
            <StyledSwitchLabel>Disabled</StyledSwitchLabel>
            <StyledSwitch />
            <StyledSwitchLabel>Enabled</StyledSwitchLabel>
          </Stack>
        </Stack>
      </AccordionDetails>
    </StyledAccordion>
  );
}

export default AdvancedConfigOptions;
