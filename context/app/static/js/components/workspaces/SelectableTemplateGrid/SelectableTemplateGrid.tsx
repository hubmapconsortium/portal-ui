import React, { useCallback, ChangeEvent, useMemo, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useController, Control, Path } from 'react-hook-form';

import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useSelectItems } from 'js/hooks/useSelectItems';
import ErrorOrWarningMessages from 'js/shared-styles/alerts/ErrorOrWarningMessages';
import { DEFAULT_R_TEMPLATE_KEY, JUPYTER_LAB_R_JOB_TYPE } from 'js/components/workspaces/constants';

import { TemplatesTypes, WorkspacesEventCategories } from '../types';
import TemplateGrid from '../TemplateGrid';
import { FormWithTemplates } from '../NewWorkspaceDialog/useCreateWorkspaceForm';
import { sortTemplates } from '../utils';

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
  const {
    selectedItems: selectedTemplates,
    setSelectedItems: setSelectedTemplates,
    addItem,
  } = useSelectItems(field.value satisfies FormType[typeof inputName]);

  const { field: jobType } = useController({
    name: 'workspaceJobTypeId' as Path<FormType>,
    control,
    rules: { required: true },
  });

  // If the Python + R job type is selected, select the default R template
  useEffect(() => {
    if (jobType.value === JUPYTER_LAB_R_JOB_TYPE) {
      addItem(DEFAULT_R_TEMPLATE_KEY);
    }
  }, [jobType.value, addItem]);

  const sortedTemplates = useMemo(() => sortTemplates(templates, disabledTemplates), [templates, disabledTemplates]);

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
        trackingInfo={{ category: WorkspacesEventCategories.WorkspaceDialog }}
        jobType={jobType.value as string}
      />
    </Box>
  );
}

export default SelectableTemplateGrid;
