import React, { useCallback, ChangeEvent, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useController, Control, Path } from 'react-hook-form';

import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useSelectItems } from 'js/hooks/useSelectItems';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { TemplatesTypes } from '../types';
import TemplateGrid from '../TemplateGrid';
import { FormWithTemplates } from '../NewWorkspaceDialog/useCreateWorkspaceForm';

interface TemplateGridProps {
  disabledTemplates?: TemplatesTypes;
  templates: TemplatesTypes;
}

const inputName = 'templates';
interface ControllerProps<FormType extends FormWithTemplates> {
  control: Control<FormType>;
}

function getActiveTemplates({ templates, disabledTemplates = {} }: TemplateGridProps) {
  return Object.keys(templates).reduce<string[]>((acc, templateKey) => {
    if (templateKey in disabledTemplates) {
      return acc;
    }
    return [...acc, templateKey];
  }, []);
}

function SelectableTemplateGrid<FormType extends FormWithTemplates>({
  templates,
  disabledTemplates,
  control,
}: TemplateGridProps & ControllerProps<FormType>) {
  const { field, fieldState } = useController<FormType>({
    control,
    name: inputName as Path<FormType>,
  });
  const { selectedItems: selectedTemplates, setSelectedItems: setSelectedTemplates } = useSelectItems(
    field.value satisfies FormType[typeof inputName],
  );

  const updateTemplates = useCallback(
    (templateKeys: string[]) => {
      setSelectedTemplates(templateKeys);
      field.onChange([...templateKeys]);
    },
    [field, setSelectedTemplates],
  );

  const selectOrUnselectTemplate = useCallback(
    (templateKey: string, action: 'select' | 'unselect') => {
      const templatesCopy = selectedTemplates;
      if (action === 'select') {
        templatesCopy.add(templateKey);
      } else {
        templatesCopy.delete(templateKey);
      }
      updateTemplates([...templatesCopy]);
    },
    [selectedTemplates, updateTemplates],
  );

  const selectItem = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        selectOrUnselectTemplate(e.target.value, 'select');
      } else {
        selectOrUnselectTemplate(e.target.value, 'unselect');
      }
    },
    [selectOrUnselectTemplate],
  );

  // Select blank template by default
  useEffect(() => {
    selectOrUnselectTemplate('blank', 'select');
  }, [selectOrUnselectTemplate]);

  const errorMessage = fieldState?.error?.message;

  return (
    <Box>
      {errorMessage && <ErrorMessages errorMessages={[errorMessage]} />}
      <SpacedSectionButtonRow
        leftText={<Typography variant="subtitle1">{selectedTemplates.size} Templates Selected</Typography>}
        buttons={
          <>
            <Button disabled={selectedTemplates.size === 0} sx={{ mr: 1 }} onClick={() => updateTemplates([])}>
              Deselect All
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => updateTemplates(getActiveTemplates({ templates, disabledTemplates }))}
            >
              Select All
            </Button>
          </>
        }
      />
      <TemplateGrid
        templates={templates}
        selectItem={selectItem}
        selectedTemplates={selectedTemplates}
        disabledTemplates={disabledTemplates}
      />
    </Box>
  );
}

export default SelectableTemplateGrid;
