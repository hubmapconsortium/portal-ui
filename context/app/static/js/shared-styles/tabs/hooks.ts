import { useState } from 'react';
import { useEventCallback } from '@mui/material/utils';

function useTabs(initialTabIndex = 0) {
  const [openTabIndex, setOpenTabIndex] = useState(initialTabIndex);

  const handleTabChange = useEventCallback((_event: React.SyntheticEvent, newValue: number) => {
    setOpenTabIndex(newValue);
  });

  return { openTabIndex, handleTabChange };
}

export { useTabs };
