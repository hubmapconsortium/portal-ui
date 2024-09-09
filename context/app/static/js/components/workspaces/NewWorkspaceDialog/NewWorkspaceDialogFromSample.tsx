import React, { PropsWithChildren, useCallback } from 'react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import Step from 'js/shared-styles/surfaces/Step';
import { Alert } from 'js/shared-styles/alerts/Alert';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';

import Accordion from '@mui/material/Accordion';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CreateWorkspaceFormTypes } from './useCreateWorkspaceForm';
import { CreateTemplateNotebooksTypes } from '../types';
import WorkspaceDatasetsTable from '../WorkspaceDatasetsTable';
import WorkspaceJobTypeField from '../WorkspaceJobTypeField';
import AdvancedConfigOptions from '../AdvancedConfigOptions';
import { StyledSubtitle1 } from '../style';

const text = {
  overview: {
    title: 'Try Sample Workspace',
    description:
      'Sample workspaces are provided to help you get started with this template and to better understand the types of data that are compatible with it.',
  },
  datasets: {
    title: 'Selected Datasets',
  },
  configure: {
    title: 'Configure Workspace',
    selected: {
      title: 'Selected Configurations',
      description:
        'The recommended configurations have been selected for this launch. You can edit these settings in future launches.',
    },
    advanced: {
      title: 'Advanced Configurations (Optional)',
      description: 'The suggested advanced configurations for this template have been selected as defaults.',
    },
  },
};

type ReactHookFormProps = Pick<UseFormReturn<CreateWorkspaceFormTypes>, 'handleSubmit' | 'control'> & {
  errors: FieldErrors<CreateWorkspaceFormTypes>;
};

interface NewWorkspaceDialogFromSampleProps {
  sample: {
    title: string;
    description: string;
    data_type: string[];
    datasets: string[];
  };
  dialogIsOpen: boolean;
  handleClose: () => void;
  onSubmit: ({ workspaceName, templateKeys, uuids }: CreateTemplateNotebooksTypes) => void;
  allDatasets: string[];
  isSubmitting?: boolean;
}

function NewWorkspaceDialogFromSample({
  sample,
  dialogIsOpen,
  handleClose,
  handleSubmit,
  control,
  errors,
  onSubmit,
  allDatasets,
  isSubmitting,
}: PropsWithChildren<NewWorkspaceDialogFromSampleProps & ReactHookFormProps>) {
  const { isOpen: isLaunchWorkspaceDialogOpen } = useLaunchWorkspaceStore();

  const submit = useCallback(
    ({
      'workspace-name': workspaceName,
      templates: templateKeys,
      workspaceJobTypeId,
      datasets,
      workspaceResourceOptions,
    }: CreateWorkspaceFormTypes) => {
      onSubmit({
        workspaceName,
        templateKeys,
        uuids: datasets,
        workspaceJobTypeId,
        workspaceResourceOptions,
      });
    },
    [onSubmit],
  );

  return (
    <Dialog
      open={dialogIsOpen && !isLaunchWorkspaceDialogOpen}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="create-workspace-dialog-title"
      maxWidth="lg"
    >
      <Box mb={2}>
        <DialogTitle id="create-workspace-dialog-title" variant="h3">
          {text.overview.title}
        </DialogTitle>
        <Box sx={{ px: 3 }}>
          <Stack spacing={1} p={2} component={Paper}>
            <Typography>{text.overview.description}</Typography>
            <Typography variant="subtitle2">{sample.title}</Typography>
            <Typography>{sample.description}</Typography>
          </Stack>
        </Box>
      </Box>
      <DialogContent dividers>
        <Step title={text.datasets.title} index={0}>
          <WorkspaceDatasetsTable
            datasetsUUIDs={allDatasets}
            emptyAlert={<Alert severity="info">No datasets available.</Alert>}
          />
        </Step>
        <Step title={text.configure.title} isRequired index={1}>
          <Box
            id="create-workspace-form"
            component="form"
            sx={{
              display: 'grid',
              gap: 2,
              marginTop: 1,
            }}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(submit)}
          >
            <WorkspaceField
              control={control}
              name="workspace-name"
              label="Workspace Name"
              placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
              autoFocus
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                e.stopPropagation();
              }}
            />
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDropDownRounded color="primary" />}>
                <Stack spacing={1}>
                  <StyledSubtitle1>{text.configure.selected.title}</StyledSubtitle1>
                  <Typography>{text.configure.selected.description}</Typography>
                  <Typography variant="subtitle2">Environment</Typography>
                  <Typography>Python 3.8</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <WorkspaceJobTypeField control={control} name="workspaceJobTypeId" />
              </AccordionDetails>
            </Accordion>
            <AdvancedConfigOptions control={control} description={text.configure.advanced.description} />
          </Box>
        </Step>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          form="create-workspace-form"
          disabled={Object.keys(errors).length > 0}
        >
          Launch Workspace
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default NewWorkspaceDialogFromSample;
