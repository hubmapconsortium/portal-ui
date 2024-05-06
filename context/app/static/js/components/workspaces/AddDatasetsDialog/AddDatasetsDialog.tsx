import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Step from 'js/shared-styles/surfaces/Step';
import { InternalLink } from 'js/shared-styles/Links';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { Workspace } from '../types';
import AddDatasetsTable from '../AddDatasetsTable';
import { useAddDatasetsDialog } from './hooks';

const searchPageRoute = '/search?entity_type[0]=Dataset';

function SearchPagePrompt() {
  return (
    <Stack component={Paper} spacing={2} padding={2}>
      <Typography>
        Enter HuBMAP IDs below to add to a workspace. Datasets that already exist in the workspace cannot be selected
        for deletion.
      </Typography>
      <Typography>
        To search for more HuBMAP datasets to be added, navigate to the{' '}
        <InternalLink href={searchPageRoute}>datasets search page</InternalLink>.
      </Typography>
      <div>
        <Button href={searchPageRoute} variant="contained" color="primary">
          Navigate To Search Page
        </Button>
      </div>
    </Stack>
  );
}

const title = 'Add Datasets';

function AddDatasetsDialog({ workspace }: { workspace: Workspace }) {
  const { submit, handleSubmit, isSubmitting, errors, reset, resetAutocompleteState, errorMessages, ...rest } =
    useAddDatasetsDialog({ workspace });

  return (
    <EditWorkspaceDialogContent
      title={title}
      reset={reset}
      resetState={resetAutocompleteState}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
      disabled={errorMessages.length > 0}
    >
      <Step title={title}>
        <Stack spacing={3}>
          {errorMessages.length > 0 && <ErrorMessages errorMessages={errorMessages} />}
          <SearchPagePrompt />
          <AddDatasetsTable {...rest} />
        </Stack>
      </Step>
    </EditWorkspaceDialogContent>
  );
}

export default AddDatasetsDialog;
