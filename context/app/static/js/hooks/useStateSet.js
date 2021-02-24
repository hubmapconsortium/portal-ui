import { useState } from 'react';

function useStateSet(initialStateArray) {
  const [setStructure, setSetStructure] = useState(new Set(initialStateArray));

  function addItemToSet(item) {
    const setCopy = new Set(setStructure);
    setCopy.add(item);
    setSetStructure(setCopy);
  }

  function removeItemFromSet(item) {
    const setCopy = new Set(setStructure);
    setCopy.delete(item);
    setSetStructure(setCopy);
  }

  return [setStructure, addItemToSet, removeItemFromSet, setSetStructure];
}

export default useStateSet;
