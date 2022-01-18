import { useState } from 'react';

function useSelectedDropdownIndex(initialIndex) {
  const [selectedDropdownIndex, setter] = useState(initialIndex || 0);
  function setSelectedDropdownIndex({ i }) {
    setter(i);
  }
  return [selectedDropdownIndex, setSelectedDropdownIndex];
}

export { useSelectedDropdownIndex };
