import { useState } from 'react';

function useSelectedDropdownIndex(initialIndex: number): [number, (args: { i: number }) => void] {
  const [selectedDropdownIndex, setter] = useState<number>(initialIndex || 0);
  function setSelectedDropdownIndex({ i }: { i: number }) {
    setter(i);
  }
  return [selectedDropdownIndex, setSelectedDropdownIndex] as const;
}

export { useSelectedDropdownIndex };
