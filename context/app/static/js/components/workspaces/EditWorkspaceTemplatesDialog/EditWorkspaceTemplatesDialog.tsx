import React, { useState, useCallback } from 'react';

import { useEditWorkspaceTemplatesStore } from 'js/stores/useWorkspaceModalStore';
import { useSelectItems } from 'js/hooks/useSelectItems';
import { useWorkspaceTemplates, useWorkspaceTemplateTags } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import { useMatchingWorkspaceTemplates } from 'js/pages/Workspace/Workspace';
import TemplateSelectStep from '../TemplateSelectStep';
import { useEditWorkspaceForm, EditTemplatesFormTypes } from './hooks';
import { MergedWorkspace } from '../types';
import EditWorkspaceDialog from '../EditWorkspaceDialog';

function Dialog({ workspace, isOpen, close }: { workspace: MergedWorkspace; isOpen: boolean; close: () => void }) {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);
  const { tags } = useWorkspaceTemplateTags();

  const workspaceId = workspace.id;

  const templatesInWorkspace = useMatchingWorkspaceTemplates(workspace);

  const { onSubmit, control, handleSubmit, isSubmitting, errors, reset } = useEditWorkspaceForm({
    workspaceId,
  });

  const submit = useCallback(
    async ({ templates: templateKeys }: EditTemplatesFormTypes) => {
      await onSubmit({
        templateKeys,
        uuids: [],
      });
    },
    [onSubmit],
  );

  return (
    <EditWorkspaceDialog
      title="Add Templates"
      isOpen={isOpen}
      close={close}
      reset={reset}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
    >
      <TemplateSelectStep
        title="Add Templates"
        control={control}
        toggleTag={toggleTag}
        tags={tags}
        selectedRecommendedTags={selectedRecommendedTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        templates={templates}
        disabledTemplates={templatesInWorkspace}
      />
    </EditWorkspaceDialog>
  );
}

function EditWorkspaceTemplatesDialog() {
  const { isOpen, close, workspace } = useEditWorkspaceTemplatesStore();

  if (!workspace) {
    return null;
  }

  return <Dialog workspace={workspace} isOpen={isOpen} close={close} />;
}

export default EditWorkspaceTemplatesDialog;
