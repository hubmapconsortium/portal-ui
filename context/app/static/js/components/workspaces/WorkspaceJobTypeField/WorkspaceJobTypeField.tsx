import React from 'react';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { useJobTypes } from '../api';
import {
  JUPYTER_LAB_GPU_JOB_TYPE,
  JUPYTER_LAB_JOB_TYPE,
  JUPYTER_LAB_NON_GPU_JOB_TYPE,
  JUPYTER_LAB_R_JOB_TYPE,
} from '../constants';

type WorkspaceJobTypeFieldProps<FormType extends FieldValues> = Pick<UseControllerProps<FormType>, 'name' | 'control'>;

const jobTypeDescriptions: Record<string, string> = {
  [JUPYTER_LAB_JOB_TYPE]: 'No packages.',
  [JUPYTER_LAB_R_JOB_TYPE]: 'Standard R packages. No Python packages.',
  [JUPYTER_LAB_NON_GPU_JOB_TYPE]:
    'Python packages: Pandas, Numpy, Scikit Learn, Pytorch (CPU), Seaborn, Scipy, Biopython, cellxgene_census, scanpy, squidpy, matplotlib, scVI, anndata, spatialdata, umap, napari.',
  [JUPYTER_LAB_GPU_JOB_TYPE]:
    'Python packages: Pandas, Numpy, Scikit Learn, Pytorch, Seaborn, Scipy, Biopython, cellxgene_census, scanpy, squidpy, matplotlib, scVI, anndata, spatialdata, umap, napari, rapids, rapids-singlecell.',
};

function JobTypeLabel({ label, id }: { label: string; id: string }) {
  const tooltip = jobTypeDescriptions?.[id];
  return (
    <>
      {label}
      {tooltip && <InfoTooltipIcon iconTooltipText={tooltip} />}
    </>
  );
}

function WorkspaceJobTypeField<FormType extends FieldValues>({ control, name }: WorkspaceJobTypeFieldProps<FormType>) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  });

  const { data } = useJobTypes();

  if (!data) {
    return null;
  }

  return (
    <Box>
      <FormLabel
        id="workspace-environment"
        sx={(theme) => ({ ...theme.typography.button, color: theme.palette.text.primary })}
      >
        Select Environment
      </FormLabel>
      <RadioGroup
        aria-labelledby="workspace-environment"
        name="workspace-environment-radio-buttons"
        value={field.value}
        onChange={(e, value) => field.onChange(value)}
      >
        {Object.values(data).map(({ id, name: jobTypeName }) => {
          return (
            <FormControlLabel
              value={id}
              control={<Radio />}
              label={<JobTypeLabel label={jobTypeName} id={id} />}
              key={id}
            />
          );
        })}
      </RadioGroup>
    </Box>
  );
}

export default WorkspaceJobTypeField;
