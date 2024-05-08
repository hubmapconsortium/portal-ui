import { useStore, CellsSearchStore } from 'js/components/cells/store';

import { useAccordionStep } from 'js/shared-styles/accordions/StepAccordion';
import { ChangeEvent } from 'react';
import { queryTypes, isQueryType } from '../queryTypes';

const cellsStoreSelector = (state: CellsSearchStore) => ({
  setQueryType: state.setQueryType,
  queryType: state.queryType,
});

function useQuerySelect() {
  const { completeStep } = useAccordionStep();

  const { setQueryType, queryType } = useStore(cellsStoreSelector);

  function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (isQueryType(value)) {
      setQueryType(value);
    }
  }

  function handleButtonClick() {
    completeStep(`${queryTypes[queryType].label} Query`);
    setQueryType(queryType);
  }

  return { queryType, handleSelect, handleButtonClick };
}

export { useQuerySelect };
