import React, { useCallback } from 'react';

import WorkspaceNameField from 'js/components/workspaces/WorkspaceField/WorkspaceNameField';
import { WorkspaceDescriptionField } from 'js/components/workspaces/WorkspaceField';
import Step from 'js/shared-styles/surfaces/Step';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { Workspace } from '../types';
import { useEditWorkspaceForm, EditWorkspaceFormTypes } from './hooks';

function EditWorkspaceNameDialog({ workspace }: { workspace: Workspace }) {
  const { name, id, description } = workspace;
  const { onSubmit, control, handleSubmit, isSubmitting, errors, reset } = useEditWorkspaceForm({
    defaultName: name,
    defaultDescription: description,
    workspaceId: id,
  });

  const submit = useCallback(
    async ({
      'workspace-name': workspaceName,
      'workspace-description': workspaceDescription,
    }: EditWorkspaceFormTypes) => {
      await onSubmit({
        workspaceName,
        workspaceDescription,
      });
    },
    [onSubmit],
  );

  return (
    <EditWorkspaceDialogContent
      title="Edit Workspace Details"
      reset={reset}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
    >
      <Step title="Edit Workspace Name or Description (Optional)">
        <WorkspaceNameField control={control} name="workspace-name" />
        <WorkspaceDescriptionField control={control} name="workspace-description" />
      </Step>
    </EditWorkspaceDialogContent>
  );
}

export default EditWorkspaceNameDialog;
