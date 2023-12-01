import React, { useCallback } from 'react';

import Step from 'js/shared-styles/surfaces/Step';
import { useEditWorkspaceForm, EditWorkspaceFormTypes } from './hooks';
import WorkspaceField from '../WorkspaceField/WorkspaceField';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { Workspace } from '../types';

function EditWorkspaceNameDialog({
  workspace,
  isOpen,
  close,
}: {
  workspace: Workspace;
  isOpen: boolean;
  close: () => void;
}) {
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
      isOpen={isOpen}
      close={close}
      reset={reset}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
    >
      <Step title="Rename Workspace">
        <WorkspaceField
          control={control}
          name="workspace-name"
          label="Name"
          placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
          autoFocus
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
          }}
        />
      </Step>
    </EditWorkspaceDialogContent>
  );
}

export default EditWorkspaceNameDialog;
