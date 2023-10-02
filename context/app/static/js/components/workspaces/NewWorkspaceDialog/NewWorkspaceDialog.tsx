import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Step from 'shared-styles/surfaces/Step';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { useSelectItems } from 'js/hooks/useSelectItems';
import TemplateGrid from '../TemplateGrid';
import { useWorkspaceTemplates } from './hooks';

function NewWorkspaceDialog() {
  const { templates } = useWorkspaceTemplates();

  const { selectedItems: selectedTemplates, toggleItem: toggleTemplate } = useSelectItems([]);

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
