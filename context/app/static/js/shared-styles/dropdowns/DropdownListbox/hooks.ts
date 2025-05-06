import { useState } from 'react';

function useSelectedDropdownIndex(initialIndex: number) {
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState<number>(initialIndex || 0);
  return [selectedDropdownIndex, setSelectedDropdownIndex] as const;
}

export { useSelectedDropdownIndex };
