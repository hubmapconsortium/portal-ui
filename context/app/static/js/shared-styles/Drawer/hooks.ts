import { useMemo, useCallback, useState } from 'react';

export function useDrawerState() {
  const [open, setOpen] = useState(false);

  const toggle = useMemo(() => () => setOpen((prev) => !prev), []);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  return {
    open,
    toggle,
    setOpen,
    onOpen,
    onClose,
  };
}
