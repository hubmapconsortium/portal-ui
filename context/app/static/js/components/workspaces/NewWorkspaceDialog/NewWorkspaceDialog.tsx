import React, { useState, PropsWithChildren, useCallback, ReactElement } from 'react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip, { ChipProps } from '@mui/material/Chip';
import Button from '@mui/material/Button';

import Step from 'js/shared-styles/surfaces/Step';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { useSelectItems } from 'js/hooks/useSelectItems';
import MultiAutocomplete from 'js/shared-styles/inputs/MultiAutocomplete';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';

import TemplateGrid from '../TemplateGrid';
import { useWorkspaceTemplates, useWorkspaceTemplateTags } from './hooks';
import { CreateWorkspaceFormTypes } from './useCreateWorkspaceForm';
import { CreateTemplateNotebooksTypes } from '../types';
import { useLaunchWorkspaceStore } from '../LaunchWorkspaceDialog/store';
import WorkspaceDatasetsTable from '../WorkspaceDatasetsTable';

function ContactPrompt() {
  return (
    <>
      If you have ideas about additional templates to include in the future, please <ContactUsLink /> .
    </>
  );
}

const text = {
  overview: {
    title: 'Launch New Workspace',
    description: [
      'Workspaces are currently Jupyter Notebooks that allows you to perform operations on HuBMAP data.',
      'Three steps are shown for launching a workspace, but the only required field to launch a workspace is “Step 2: Configure Workspace”. “Step 1: Edit Datasets Selection” is only required if there are issues with any of the datasets selected, which will be indicated by an error banner.',
    ],
  },
  datasets: {
    title: 'Edit Datasets Selection',
    description: [
      'To remove a dataset, select the dataset and press the delete button. If all datasets are removed, an empty workspace will be launched.',
      'To add more datasets to a workspace, you must navigate to the dataset search page, select datasets of interests and follow steps to launch a workspace from the search page. As a reminder, once you navigate away from this page, all selected datasets will be lost so take note of any HuBMAP IDs of interest, or copy IDs to your clipboard by selecting datasets in the table below and pressing the copy button. You can also save datasets to the “My Lists” feature.',
    ],
  },
  configure: { title: 'Configure Workspace' },
  templates: {
    title: 'Select Templates',
    description: [
      'Templates can be selected for your workspace for potential workflows revolving around data assays, visualization, QA or other purposes. Multiple templates can be selected. If you are unsure of which templates to launch, the “Select All” button selects all templates.',
      <ContactPrompt />,
    ],
  },
};

function Description({ blocks }: { blocks: (string | ReactElement)[] }) {
  return (
    <Stack gap={2} sx={{ p: 2 }} component={Paper} direction="column">
      {blocks.map((block) => (
        <Typography key={String(block)}>{block}</Typography>
      ))}
    </Stack>
  );
}

interface TagTypes extends ChipProps {
  option: string;
}

function TagComponent({ option, ...rest }: TagTypes) {
  return <Chip label={option} {...rest} />;
}

type ReactHookFormProps = Pick<UseFormReturn<CreateWorkspaceFormTypes>, 'handleSubmit' | 'control'> & {
  errors: FieldErrors<CreateWorkspaceFormTypes>;
};

interface NewWorkspaceDialogProps {
  datasetUUIDs?: Set<string>;
  errorMessages?: string[];
  dialogIsOpen: boolean;
  handleClose: () => void;
  removeDatasets?: (datasetUUIDs: string[]) => void;
  onSubmit: ({ workspaceName, templateKeys, uuids }: CreateTemplateNotebooksTypes) => void;
}

const recommendedTags = ['visualization', 'api'];

function NewWorkspaceDialog({
  datasetUUIDs = new Set(),
  errorMessages = [],
  dialogIsOpen,
  handleClose,
  handleSubmit,
  control,
  errors,
  onSubmit,
  removeDatasets,
  children,
}: PropsWithChildren<NewWorkspaceDialogProps & ReactHookFormProps>) {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { isOpen: isLaunchWorkspaceDialogOpen } = useLaunchWorkspaceStore();

  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);

  const { tags } = useWorkspaceTemplateTags();

  const submit = useCallback(
    ({ 'workspace-name': workspaceName, templates: templateKeys }: CreateWorkspaceFormTypes) => {
      onSubmit({
        workspaceName,
        templateKeys,
        uuids: [...datasetUUIDs],
      });
    },
    [datasetUUIDs, onSubmit],
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
          <Description blocks={text.overview.description} />
        </Box>
      </Box>
      <DialogContent dividers>
        <Step title={text.datasets.title} index={0}>
          <Stack spacing={1}>
            {children}
            <Description blocks={text.datasets.description} />
            {datasetUUIDs.size > 0 && (
              <WorkspaceDatasetsTable datasetsUUIDs={[...datasetUUIDs]} removeDatasets={removeDatasets} />
            )}
          </Stack>
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
            <WorkspaceField<CreateWorkspaceFormTypes>
              control={control}
              name="workspace-name"
              label="Name"
              placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
              autoFocus
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                e.stopPropagation();
              }}
            />
          </Box>
        </Step>
        <Step title={text.templates.title} index={2}>
          <Description blocks={text.templates.description} />
          <Typography sx={{ mt: 2 }} variant="subtitle1">
            Filter workspace templates by tags
          </Typography>
          <Stack spacing={1}>
            <MultiAutocomplete<string>
              value={selectedTags}
              options={Object.keys(tags)
                .filter((tag) => !recommendedTags.includes(tag))
                .sort((a, b) => a.localeCompare(b))}
              multiple
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option === value}
              tagComponent={TagComponent}
              onChange={(_, value: string[]) => {
                setSelectedTags(value);
              }}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Recommended Tags
              </Typography>
              <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                {recommendedTags.map((tag) => (
                  <SelectableChip
                    isSelected={selectedRecommendedTags.has(tag)}
                    label={tag}
                    onClick={() => toggleTag(tag)}
                    key={tag}
                  />
                ))}
              </Stack>
            </Box>
            <TemplateGrid templates={templates} control={control} />
          </Stack>
        </Step>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="submit"
          form="create-workspace-form"
          disabled={Object.keys(errors).length > 0 || errorMessages.length > 0}
        >
          Launch Workspace
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewWorkspaceDialog;
