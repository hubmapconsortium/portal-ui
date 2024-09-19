import React, { useCallback } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';

import { ControllerRenderProps, FieldValues, Path, useController, UseControllerProps } from 'react-hook-form';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { StyledAccordion, StyledSwitch } from './style';
import { StyledSubtitle1, StyledSubtitle2 } from '../style';
import {
  DEFAULT_GPU_ENABLED,
  DEFAULT_MEMORY_MB,
  DEFAULT_NUM_CPUS,
  DEFAULT_TIME_LIMIT_MINUTES,
  MAX_MEMORY_MB,
  MAX_NUM_CPUS,
  MAX_TIME_LIMIT_MINUTES,
  MIN_MEMORY_MB,
  MIN_NUM_CPUS,
  MIN_TIME_LIMIT_MINUTES,
} from '../constants';
import { convert, unconvert } from '../utils';

interface ConfigSliderProps<FormType extends FieldValues> {
  field: ControllerRenderProps<FormType, Path<FormType>>;
  id: string;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  conversionFactor?: number;
  numMarks?: number;
}

function ConfigSlider<FormType extends FieldValues>({
  field,
  id,
  label,
  tooltip,
  min,
  max,
  conversionFactor = 1,
  numMarks,
}: ConfigSliderProps<FormType>) {
  const convertedMin = convert(min, conversionFactor);
  const convertedMax = convert(max, conversionFactor);

  const step = numMarks ? convertedMax / numMarks : 1;

  const marks = Array.from({ length: convertedMax / step }, (_, i) => {
    const value = convertedMin % 2 === 0 ? convertedMin : 0 + step * (i + 1);
    return {
      value,
      label: value.toString(),
    };
  });

  return (
    <Stack marginTop={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledSubtitle2>{label}</StyledSubtitle2>
        <InfoTooltipIcon iconTooltipText={tooltip} />
      </Stack>
      <Stack padding={1}>
        <Slider
          value={convert(field.value[id] as number, conversionFactor)}
          onChange={(e, value) =>
            field.onChange({
              ...field.value,
              [id]: unconvert(value as number, conversionFactor),
            })
          }
          valueLabelDisplay="auto"
          marks={marks}
          min={convertedMin}
          max={convertedMax}
        />
      </Stack>
    </Stack>
  );
}

const configSliderOptions: Omit<ConfigSliderProps<Record<string, number>>, 'field'>[] = [
  {
    id: 'time_limit_minutes',
    label: 'Time Limit (hours)',
    tooltip: 'Session duration for your workspace.',
    min: MIN_TIME_LIMIT_MINUTES,
    max: MAX_TIME_LIMIT_MINUTES,
    conversionFactor: 60,
  },
  {
    id: 'memory_mb',
    label: 'Memory (GB)',
    tooltip: 'Available memory for your workspace.',
    min: MIN_MEMORY_MB,
    max: MAX_MEMORY_MB,
    conversionFactor: 1024,
    numMarks: 16,
  },
  {
    id: 'num_cpus',
    label: 'Number of CPUs',
    tooltip: 'Number of CPUs available for your workspace.',
    min: MIN_NUM_CPUS,
    max: MAX_NUM_CPUS,
  },
];

type WorkspaceJobTypeFieldProps<FormType extends FieldValues> = Pick<UseControllerProps<FormType>, 'control'>;

function AdvancedConfigOptions<FormType extends FieldValues>({
  control,
  description,
}: WorkspaceJobTypeFieldProps<FormType> & { description: string }) {
  const { field } = useController({
    name: 'workspaceResourceOptions' as Path<FormType>,
    control,
    rules: { required: true },
  });

  const isDefault =
    field.value.time_limit_minutes === DEFAULT_TIME_LIMIT_MINUTES &&
    field.value.memory_mb === DEFAULT_MEMORY_MB &&
    field.value.num_cpus === DEFAULT_NUM_CPUS &&
    field.value.gpu_enabled === DEFAULT_GPU_ENABLED;

  const handleRestoreDefaults = useCallback(() => {
    field.onChange({
      time_limit_minutes: DEFAULT_TIME_LIMIT_MINUTES,
      memory_mb: DEFAULT_MEMORY_MB,
      num_cpus: DEFAULT_NUM_CPUS,
      gpu_enabled: DEFAULT_GPU_ENABLED,
    });
  }, [field]);

  return (
    <StyledAccordion>
      <AccordionSummary expandIcon={<ArrowDropDownRounded color="primary" />}>
        <StyledSubtitle1>Advanced Configurations (Optional)</StyledSubtitle1>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          <Typography marginBottom={1}>{description}</Typography>
          <Button
            variant="contained"
            sx={{ alignSelf: 'flex-end' }}
            disabled={isDefault}
            onClick={handleRestoreDefaults}
          >
            Restore Defaults
          </Button>
          {configSliderOptions.map((props) => (
            <ConfigSlider key={props.id} field={field} {...props} />
          ))}
          <StyledSubtitle2>Enable GPU</StyledSubtitle2>
          <Stack direction="row" component="label" alignItems="center">
            <Typography variant="caption">Disabled</Typography>
            <StyledSwitch
              checked={field.value.gpu_enabled as boolean}
              onChange={(e, value) =>
                field.onChange({
                  ...field.value,
                  gpu_enabled: value,
                })
              }
            />
            <Typography variant="caption">Enabled</Typography>
          </Stack>
        </Stack>
      </AccordionDetails>
    </StyledAccordion>
  );
}

export default AdvancedConfigOptions;
