import { useReducer, useState } from 'react';

import { useStore } from 'js/components/entity-search/SearchWrapper/store';

function selectedFieldReducer(state, { type, payload }) {
  const tempState = { ...state };
  switch (type) {
    case 'selectItem':
      return { ...state, [payload.identifier]: payload };
    case 'deselectItem':
      delete tempState[payload.identifier];
      return { ...tempState };
    case 'setSelectedItems':
      return payload;
    default:
      return state;
  }
}

function useSelectedItems(reducer, initialItems) {
  const [selectedItems, dispatch] = useReducer(reducer, initialItems);

  const selectItem = (payload) => dispatch({ type: 'selectItem', payload });
  const deselectItem = (payload) => dispatch({ type: 'deselectItem', payload });
  const setSelectedItems = (payload) => dispatch({ type: 'setSelectedItems', payload });

  function handleToggleItem(event, fieldConfig) {
    if (event.target.checked) {
      selectItem(fieldConfig);
      return;
    }
    deselectItem(fieldConfig);
  }

  return { selectedItems, handleToggleItem, setSelectedItems };
}

function useConfigureSearch() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { setFields, setFacets, fields, facets } = useStore();
  const {
    selectedItems: selectedFields,
    handleToggleItem: handleToggleField,
    setSelectedItems: setSelectedFields,
  } = useSelectedItems(selectedFieldReducer, fields);

  const {
    selectedItems: selectedFacets,
    handleToggleItem: handleToggleFacet,
    setSelectedItems: setSelectedFacets,
  } = useSelectedItems(selectedFieldReducer, facets);

  function handleOpen() {
    setDialogIsOpen(true);
  }
  function handleClose() {
    setDialogIsOpen(false);
    setSelectedFields(fields);
    setSelectedFacets(facets);
  }

  function handleSave() {
    setFields(selectedFields);
    setFacets(selectedFacets);
    setDialogIsOpen(false);
  }
  return {
    dialogIsOpen,
    handleOpen,
    handleClose,
    handleSave,
    selectedFields,
    handleToggleField,
    selectedFacets,
    handleToggleFacet,
  };
}

export { useConfigureSearch, useSelectedItems };
