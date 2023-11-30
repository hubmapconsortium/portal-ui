import React, { useCallback, useEffect } from 'react';

import { useEditWorkspaceNameStore } from 'js/stores/useWorkspaceModalStore';
import Step from 'js/shared-styles/surfaces/Step';
import { useEditWorkspaceForm, EditWorkspaceFormTypes } from './hooks';
import WorkspaceField from '../WorkspaceField/WorkspaceField';
import EditWorkspaceDialog from '../EditWorkspaceDialog';

function Dialog({
  workspaceName,
  workspaceId,
  isOpen,
  close,
}: {
  workspaceName: string;
  workspaceId: number;
  isOpen: boolean;
  close: () => void;
}) {
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

  useEffect(() => reset(), [isOpen, reset]);

  return (
    <EditWorkspaceDialog
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
    </EditWorkspaceDialog>
  );
}

function EditWorkspaceNameDialog() {
  const { isOpen, close, workspace } = useEditWorkspaceNameStore();
  const workspaceName = workspace?.name;
  const workspaceId = workspace?.id;

  if (!(workspaceName && workspaceId)) {
    return null;
  }

  return <Dialog workspaceName={workspaceName} workspaceId={workspaceId} isOpen={isOpen} close={close} />;
}

export default EditWorkspaceNameDialog;
