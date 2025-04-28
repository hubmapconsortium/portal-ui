import React from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import WorkspaceField from 'js/components/workspaces/WorkspaceField/WorkspaceField';

function WorkspaceNameField<FormType extends FieldValues>({ control, name }: UseControllerProps<FormType>) {
  return (
    <WorkspaceField
      control={control}
      name={name}
      label="Workspace Name"
      placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
      maxLength={50}
      autoFocus
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
    />
  );
}

export default WorkspaceNameField;
