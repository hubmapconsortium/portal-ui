import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip, { ChipProps } from '@mui/material/Chip';
import Step from 'shared-styles/surfaces/Step';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { useSelectItems } from 'js/hooks/useSelectItems';
import MultiAutocomplete from 'js/shared-styles/inputs/MultiAutocomplete';
import TemplateGrid from '../TemplateGrid';
import { useWorkspaceTemplates, useWorkspaceTemplateTags } from './hooks';

interface TagTypes extends ChipProps {
  option: string;
}

function TagComponent({ option, ...rest }: TagTypes) {
  return <Chip label={option} {...rest} />;
}

const recommendedTags = ['visualization', 'api'];

function NewWorkspaceDialog() {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);

  const { selectedItems: selectedTemplates, toggleItem: toggleTemplate } = useSelectItems([]);

  const { tags } = useWorkspaceTemplateTags();

  return (
    <Dialog
      open
      // onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="lg"
    >
      <Box mb={2}>
        <DialogTitle id="scroll-dialog-title" variant="h3">
          Launch New Workspace
        </DialogTitle>
        <Box sx={{ px: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ mb: 2 }}>
              Workspaces are currently Jupyter Notebooks that allows you to perform operations on HuBMAP data.
            </Typography>
            <Typography>
              Three steps are shown for launching a workspace, but the only required field to launch a workspace is
              “Step 2: Configure Workspace”. “Step 1: Edit Datasets Selection” is only required if there are issues with
              any of the datasets selected, which will be indicated by an error banner.
            </Typography>
          </Paper>
        </Box>
      </Box>
      <DialogContent dividers>
        <Step title="Edit Datasets Selection" index={0}>
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ mb: 2 }}>
              To remove a dataset, select the dataset and press the delete button. If all datasets are removed, an empty
              workspace will be launched.
            </Typography>
            <Typography>
              To add more datasets to a workspace, you must navigate to the dataset search page, select datasets of
              interests and follow steps to launch a workspace from the search page. As a reminder, once you navigate
              away from this page, all selected datasets will be lost so take note of any HuBMAP IDs of interest, or
              copy IDs to your clipboard by selecting datasets in the table below and pressing the copy button. You can
              also save datasets to the “My Lists” feature.
            </Typography>
          </Paper>
        </Step>
        <Step title="Configure Workspace" isRequired index={0} />
        <Step title="Select Templates" index={0}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography sx={{ mb: 2 }}>
              Templates can be selected for your workspace for potential workflows revolving around data assays,
              visualization, QA or other purposes. Multiple templates can be selected. If you are unsure of which
              templates to launch, the “Select All” button selects all templates.
            </Typography>
            <Typography>
              If you have ideas about additional templates to include in the future, please <ContactUsLink /> .
            </Typography>
          </Paper>
          <MultiAutocomplete
            value={selectedTags}
            options={Object.keys(tags).filter((tag) => !recommendedTags.includes(tag))}
            multiple
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option === value}
            tagComponent={TagComponent}
            onChange={(_, value: string[]) => {
              setSelectedTags(value);
            }}
          />
          <Typography variant="subtitle2">Recommended Tags</Typography>
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
          <TemplateGrid templates={templates} selectedTemplates={selectedTemplates} toggleTemplate={toggleTemplate} />
        </Step>
      </DialogContent>
      <DialogActions>
        <div>HELLO!</div>
      </DialogActions>
    </Dialog>
  );
}

export default NewWorkspaceDialog;
