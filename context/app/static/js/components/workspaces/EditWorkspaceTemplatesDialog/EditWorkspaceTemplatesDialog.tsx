import React, { useState, useCallback } from 'react';

import { useSelectItems } from 'js/hooks/useSelectItems';
import { useWorkspaceTemplates, useWorkspaceTemplateTags } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import TemplateSelectStep from '../TemplateSelectStep';
import { useEditWorkspaceForm, EditTemplatesFormTypes } from './hooks';
import { Workspace } from '../types';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { useWorkspaceDetail } from '../hooks';

function EditWorkspaceTemplatesDialog({
  workspace,
  isOpen,
  close,
}: {
  workspace: Workspace;
  isOpen: boolean;
  close: () => void;
}) {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);
  const { tags } = useWorkspaceTemplateTags();

  const workspaceId = workspace.id;
  const { workspaceTemplates, workspaceDatasets } = useWorkspaceDetail({ workspaceId });

  const { onSubmit, control, handleSubmit, isSubmitting, errors, reset } = useEditWorkspaceForm({
    workspaceId,
  });

  const submit = useCallback(
    async ({ templates: templateKeys }: EditTemplatesFormTypes) => {
      await onSubmit({
        templateKeys,
        uuids: workspaceDatasets,
      });
    },
    [onSubmit, workspaceDatasets],
  );

  return (
    <EditWorkspaceDialogContent
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
        disabledTemplates={workspaceTemplates}
      />
    </EditWorkspaceDialogContent>
  );
}

export default EditWorkspaceTemplatesDialog;
