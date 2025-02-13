import { useState } from 'react';

function useStateSet<T>(initialStateArray: T[] = []) {
  const [setStructure, setSetStructure] = useState<Set<T>>(new Set(initialStateArray));

  function addItemToSet(item: T): void {
    setSetStructure((prevSet) => new Set(prevSet).add(item));
  }

  function removeItemFromSet(item: T): void {
    setSetStructure((prevSet) => {
      const setCopy = new Set(prevSet);
      setCopy.delete(item);
      return setCopy;
    });
  }

  return [setStructure, addItemToSet, removeItemFromSet, setSetStructure] as const;
}

export default useStateSet;
