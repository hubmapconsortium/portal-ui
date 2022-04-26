import { useReducer, useState } from 'react';

import { useStore } from 'js/components/entity-search/SearchWrapper/store';

function selectedFieldReducer(state, { type, payload }) {
  const tempState = state;
  switch (type) {
    case 'selectField':
      return { ...state, [payload.identifier]: payload };
    case 'deselectField':
      delete tempState[payload.identifier];
      return { ...tempState };
    default:
      return state;
  }
}

function useSelectedFields() {
  const [selectedFields, dispatch] = useReducer(selectedFieldReducer, {});

  const selectField = (payload) => dispatch({ type: 'selectField', payload });
  const deselectField = (payload) => dispatch({ type: 'deselectField', payload });

  function handleToggleCheckbox(event, fieldConfig) {
    if (event.target.checked) {
      selectField(fieldConfig);
      return;
    }
    deselectField(fieldConfig);
  }

  return { selectedFields, handleToggleCheckbox };
}

function useConfigureSearch() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { selectedFields, handleToggleField } = useSelectedFields();
  const { setFields } = useStore();

  function handleOpen() {
    setDialogIsOpen(true);
  }
  function handleClose() {
    setDialogIsOpen(false);
  }

  function handleSave() {
    setFields(selectedFields);
    setDialogIsOpen(false);
  }
  return { dialogIsOpen, handleOpen, handleClose, handleSave, selectedFields, handleToggleField };
}

export { useConfigureSearch };
