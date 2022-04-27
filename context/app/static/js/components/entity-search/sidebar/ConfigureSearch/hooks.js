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
    case 'setSelectedFields':
      return payload;
    default:
      return state;
  }
}

function useSelectedFields(initialFields) {
  const [selectedFields, dispatch] = useReducer(selectedFieldReducer, initialFields);

  const selectField = (payload) => dispatch({ type: 'selectField', payload });
  const deselectField = (payload) => dispatch({ type: 'deselectField', payload });
  const setSelectedFields = (payload) => dispatch({ type: 'setSelectedFields', payload });

  function handleToggleField(event, fieldConfig) {
    if (event.target.checked) {
      selectField(fieldConfig);
      return;
    }
    deselectField(fieldConfig);
  }

  return { selectedFields, handleToggleField, setSelectedFields };
}

function useConfigureSearch() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { setFields, fields } = useStore();
  const { selectedFields, handleToggleField, setSelectedFields } = useSelectedFields(fields);

  function handleOpen() {
    setDialogIsOpen(true);
  }
  function handleClose() {
    setDialogIsOpen(false);
    setSelectedFields(fields);
  }

  function handleSave() {
    setFields(selectedFields);
    setDialogIsOpen(false);
  }
  return { dialogIsOpen, handleOpen, handleClose, handleSave, selectedFields, handleToggleField };
}

export { useConfigureSearch };
