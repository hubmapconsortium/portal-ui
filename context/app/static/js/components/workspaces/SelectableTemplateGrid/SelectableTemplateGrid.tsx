import React, { useCallback, ChangeEvent } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useController, UseControllerProps } from 'react-hook-form';

import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useSelectItems } from 'js/hooks/useSelectItems';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { TemplatesTypes } from '../types';
import { CreateWorkspaceFormTypes } from '../NewWorkspaceDialog/useCreateWorkspaceForm';
import TemplateGrid from '../TemplateGrid';

interface TemplateGridProps {
  templates: TemplatesTypes;
}

type ControllerProps = Pick<UseControllerProps<CreateWorkspaceFormTypes>, 'control'>;

const inputName = 'templates';

function SelectableTemplateGrid({ templates, control }: TemplateGridProps & ControllerProps) {
  const { field, fieldState } = useController({
    control,
    name: inputName,
  });
  const { selectedItems: selectedTemplates, setSelectedItems: setSelectedTemplates } = useSelectItems(field.value);

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
      {errorMessage && <ErrorMessages errorMessages={[errorMessage]} />}
      <SpacedSectionButtonRow
        leftText={<Typography variant="subtitle1">{selectedTemplates.size} Templates Selected</Typography>}
        buttons={
          <>
            <Button disabled={selectedTemplates.size === 0} sx={{ mr: 1 }} onClick={() => updateTemplates([])}>
              Deselect All
            </Button>
            <Button color="primary" variant="contained" onClick={() => updateTemplates(Object.keys(templates))}>
              Select All
            </Button>
          </>
        }
      />
      <TemplateGrid templates={templates} selectItem={selectItem} selectedTemplates={selectedTemplates} />
    </Box>
  );
}

export default SelectableTemplateGrid;
