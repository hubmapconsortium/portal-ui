import React from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import WorkspaceField from 'js/components/workspaces/WorkspaceField/WorkspaceField';

function WorkspaceDescriptionField<FormType extends FieldValues>({ control, name }: UseControllerProps<FormType>) {
  return (
    <WorkspaceField
      control={control}
      name={name}
      label="Workspace Description (Optional)"
      placeholder="Add workspace description to describe your workspace"
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
      }}
      multiline
    />
  );
}

export default WorkspaceDescriptionField;
