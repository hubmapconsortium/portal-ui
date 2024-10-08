import React, { useState, useCallback } from 'react';

import { useSelectItems } from 'js/hooks/useSelectItems';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import TemplateSelectStep from '../TemplateSelectStep';
import { useEditWorkspaceForm, EditTemplatesFormTypes } from './hooks';
import { Workspace } from '../types';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { useWorkspaceDetail } from '../hooks';

function EditWorkspaceTemplatesDialog({ workspace }: { workspace: Workspace }) {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);

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
