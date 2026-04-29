import React, { useEffect, useRef } from 'react';

import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import YACConflictDialogWrapper from 'js/components/workspaces/NewWorkspaceDialog/YACConflictDialogWrapper';

import useOpenInWorkspacesTrigger from './openInWorkspacesStore';

function OpenInWorkspacesFromYAC() {
  const pending = useOpenInWorkspacesTrigger((s) => s.pending);
  const reset = useOpenInWorkspacesTrigger((s) => s.reset);

  const ids = pending?.ids ?? [];

  const { setDialogIsOpen, dialogIsOpen, showYACConflictDialog, setShowYACConflictDialog, yacConflictData, ...rest } =
    useCreateWorkspaceForm({
      initialSelectedDatasets: ids,
    });

  const lastNonce = useRef<number | null>(null);
  useEffect(() => {
    if (pending && pending.nonce !== lastNonce.current) {
      lastNonce.current = pending.nonce;
      setDialogIsOpen(true);
    }
  }, [pending, setDialogIsOpen]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !dialogIsOpen) {
      reset();
    }
    wasOpen.current = dialogIsOpen;
  }, [dialogIsOpen, reset]);

  return (
    <>
      <NewWorkspaceDialog
        showDatasetsSearchBar
        trackingInfo={{ category: WorkspacesEventCategories.WorkspaceDialog }}
        dialogIsOpen={dialogIsOpen}
        {...rest}
      />
      <YACConflictDialogWrapper
        showDialog={showYACConflictDialog}
        setShowDialog={setShowYACConflictDialog}
        conflictData={yacConflictData}
      />
    </>
  );
}

export default OpenInWorkspacesFromYAC;
