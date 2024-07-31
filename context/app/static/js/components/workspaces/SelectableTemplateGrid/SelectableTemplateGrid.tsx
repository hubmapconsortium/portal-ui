import React, { useCallback, ChangeEvent, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useController, Control, Path } from 'react-hook-form';

import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useSelectItems } from 'js/hooks/useSelectItems';
import ErrorOrWarningMessages from 'js/shared-styles/alerts/ErrorOrWarningMessages';
import { TemplatesTypes } from '../types';
import TemplateGrid from '../TemplateGrid';
import { FormWithTemplates } from '../NewWorkspaceDialog/useCreateWorkspaceForm';
import { DEFAULT_TEMPLATE_KEY } from '../constants';

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

  // Sort templates alphabetically by title with selected templates first, then default template
  const sortedTemplates = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(templates).sort(([keyA, templateA], [keyB, templateB]) => {
          const isSelectedA = disabledTemplates && keyA in disabledTemplates;
          const isSelectedB = disabledTemplates && keyB in disabledTemplates;

          if (isSelectedA && !isSelectedB) return -1;
          if (!isSelectedA && isSelectedB) return 1;

          if (keyA === DEFAULT_TEMPLATE_KEY && keyB !== DEFAULT_TEMPLATE_KEY) return -1;
          if (keyB === DEFAULT_TEMPLATE_KEY && keyA !== DEFAULT_TEMPLATE_KEY) return 1;

          return templateA.title.localeCompare(templateB.title);
        }),
      ) as TemplatesTypes,
    [templates, disabledTemplates],
  );

  const updateTemplates = useCallback(
    (templateKeys: string[]) => {
      setSelectedTemplates(templateKeys);
      field.onChange([...templateKeys]);
    },
    [field, setSelectedTemplates],
  );

  const selectItem = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const templatesCopy = selectedTemplates;
      if (e.target.checked) {
        templatesCopy.add(e.target.value);
      } else {
        templatesCopy.delete(e.target.value);
      }
      updateTemplates([...templatesCopy]);
    },
    [updateTemplates, selectedTemplates],
  );

  const errorMessage = fieldState?.error?.message;

  return (
    <Box>
      {errorMessage && <ErrorOrWarningMessages errorMessages={[errorMessage]} />}
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
        templates={sortedTemplates}
        selectItem={selectItem}
        selectedTemplates={selectedTemplates}
        disabledTemplates={disabledTemplates}
      />
    </Box>
  );
}

export default SelectableTemplateGrid;
