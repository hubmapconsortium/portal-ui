import { useStore, CellsSearchStore } from 'js/components/cells/store';
import { capitalizeString } from 'js/helpers/functions';

import { useAccordionStep } from 'js/shared-styles/accordions/StepAccordion';
import { ChangeEvent } from 'react';

const cellsStoreSelector = (state: CellsSearchStore) => ({
  setQueryType: state.setQueryType,
  selectedQueryType: state.selectedQueryType,
  setSelectedQueryType: state.setSelectedQueryType,
});

function useQuerySelect() {
  const { completeStep } = useAccordionStep();

  const { setQueryType, selectedQueryType, setSelectedQueryType } = useStore(cellsStoreSelector);

  function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    setSelectedQueryType(event.target.value);
  }

  function handleButtonClick() {
    completeStep(`${capitalizeString(selectedQueryType)} Query`);
    setQueryType(selectedQueryType);
  }

  return { selectedQueryType, handleSelect, handleButtonClick };
}

export { useQuerySelect };
