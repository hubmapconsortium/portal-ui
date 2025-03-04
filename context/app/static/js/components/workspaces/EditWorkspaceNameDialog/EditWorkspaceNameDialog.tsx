import React, { useCallback } from 'react';

import WorkspaceNameField from 'js/components/workspaces/WorkspaceField/WorkspaceNameField';
import Step from 'js/shared-styles/surfaces/Step';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { Workspace } from '../types';
import { useEditWorkspaceForm, EditWorkspaceFormTypes } from './hooks';

function EditWorkspaceNameDialog({ workspace }: { workspace: Workspace }) {
  const workspaceName = workspace.name;
  const workspaceId = workspace.id;
  const { onSubmit, control, handleSubmit, isSubmitting, errors, reset } = useEditWorkspaceForm({
    defaultName: workspaceName,
    workspaceId,
  });

  const submit = useCallback(
    async ({ 'workspace-name': wsName }: EditWorkspaceFormTypes) => {
      await onSubmit({
        workspaceName: wsName,
      });
    },
    [onSubmit],
  );

  return (
    <EditWorkspaceDialogContent
      title="Edit Workspace Name"
      reset={reset}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
    >
      <Step title="Rename Workspace">
        <WorkspaceNameField control={control} name="workspace-name" />
      </Step>
    </EditWorkspaceDialogContent>
  );
}

export default EditWorkspaceNameDialog;
