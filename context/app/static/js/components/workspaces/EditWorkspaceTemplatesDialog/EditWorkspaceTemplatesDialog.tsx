import React, { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import DialogModal from 'js/shared-styles/DialogModal';
import { useEditWorkspaceTemplatesStore } from 'js/stores/useWorkspaceModalStore';
import { useSelectItems } from 'js/hooks/useSelectItems';
import { useWorkspaceTemplates, useWorkspaceTemplateTags } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import TemplateSelectStep from '../TemplateSelectStep';
import { useEditWorkspaceForm, EditTemplatesFormTypes } from './hooks';

function Dialog({ workspaceId, isOpen, close }: { workspaceId: number; isOpen: boolean; close: () => void }) {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);
  const { tags } = useWorkspaceTemplateTags();

  const { onSubmit, control, handleSubmit, isSubmitting, errors } = useEditWorkspaceForm({
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
    <DialogModal
      title="Edit Workspace Name"
      maxWidth="lg"
      content={
        <Box
          id="edit-workspace-templates-form"
          component="form"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submit)}
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
          />
        </Box>
      }
      isOpen={isOpen}
      handleClose={close}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={close}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            form="edit-workspace-templates-form"
            disabled={Object.keys(errors).length > 0}
          >
            Save
          </LoadingButton>
        </Stack>
      }
      withCloseButton
    />
  );
}

function EditWorkspaceTemplatesDialog() {
  const { isOpen, close, workspace } = useEditWorkspaceTemplatesStore();
  const workspaceId = workspace?.id;

  if (!workspaceId) {
    return null;
  }

  return <Dialog workspaceId={workspaceId} isOpen={isOpen} close={close} />;
}

export default EditWorkspaceTemplatesDialog;
