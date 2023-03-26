import { useStore } from 'js/components/cells/store';
import { capitalizeString } from 'js/helpers/functions';

const cellsStoreSelector = (state) => ({
  setQueryType: state.setQueryType,
  selectedQueryType: state.selectedQueryType,
  setSelectedQueryType: state.setSelectedQueryType,
});

function useQuerySelect(completeStep) {
  const { setQueryType, selectedQueryType, setSelectedQueryType } = useStore(cellsStoreSelector);

  function handleSelect(event) {
    setSelectedQueryType(event.target.value);
  }

  function handleButtonClick() {
    completeStep(`${capitalizeString(selectedQueryType)} Query`);
    setQueryType(selectedQueryType);
  }

  return { selectedQueryType, handleSelect, handleButtonClick };
}

export { useQuerySelect };
