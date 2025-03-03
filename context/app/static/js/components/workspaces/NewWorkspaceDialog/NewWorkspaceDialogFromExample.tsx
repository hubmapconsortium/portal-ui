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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownRounded from '@mui/icons-material/ArrowDropDownRounded';

import Step from 'js/shared-styles/surfaces/Step';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { CreateTemplateNotebooksTypes, TemplateExample } from 'js/components/workspaces/types';
import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import AdvancedConfigOptions from 'js/components/workspaces/AdvancedConfigOptions';
import { StyledSubtitle1 } from 'js/components/workspaces/style';
import WorkspacesNoDatasetsAlert from 'js/components/workspaces/WorkspacesNoDatasetsAlert';
import { CreateWorkspaceFormTypes } from './useCreateWorkspaceForm';

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

interface NewWorkspaceDialogFromExampleProps {
  example: TemplateExample;
  dialogIsOpen: boolean;
  handleClose: () => void;
  onSubmit: ({ workspaceName, templateKeys, uuids }: CreateTemplateNotebooksTypes) => void;
  allDatasets: string[];
  jobTypeName: string;
  isSubmitting?: boolean;
}

function NewWorkspaceDialogFromExample({
  example,
  dialogIsOpen,
  handleClose,
  handleSubmit,
  control,
  errors,
  onSubmit,
  allDatasets,
  jobTypeName,
  isSubmitting,
}: PropsWithChildren<NewWorkspaceDialogFromExampleProps & ReactHookFormProps>) {
  const { isOpen: isLaunchWorkspaceDialogOpen } = useLaunchWorkspaceStore();

  const submit = useCallback(
    ({
      'workspace-name': workspaceName,
      'workspace-description': workspaceDescription,
      templates: templateKeys,
      workspaceJobTypeId,
      datasets,
      workspaceResourceOptions,
    }: CreateWorkspaceFormTypes) => {
      onSubmit({
        workspaceName,
        workspaceDescription,
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
            <Typography variant="subtitle2">{example.title}</Typography>
            <Typography>{example.description}</Typography>
          </Stack>
        </Box>
      </Box>
      <DialogContent dividers>
        <Step title={text.datasets.title} index={0} hideRequiredText>
          <WorkspaceDatasetsTable
            datasetsUUIDs={allDatasets}
            emptyAlert={<WorkspacesNoDatasetsAlert />}
            isSelectable={false}
          />
        </Step>
        <Step title={text.configure.title} index={1} isRequired>
          <Stack
            gap={2}
            mt={1}
            component="form"
            id="create-workspace-form"
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
                <StyledSubtitle1>{text.configure.selected.title}</StyledSubtitle1>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <Typography>{text.configure.selected.description}</Typography>
                  <Typography variant="subtitle2">Environment</Typography>
                  <Typography>{jobTypeName}</Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <AdvancedConfigOptions control={control} description={text.configure.advanced.description} />
          </Stack>
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

export default NewWorkspaceDialogFromExample;
