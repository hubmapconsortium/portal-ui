import { useReducer } from 'react';

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

export { useSelectedFields };
