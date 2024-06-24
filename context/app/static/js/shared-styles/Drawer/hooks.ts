import { useMemo, useState } from 'react';

export function useDrawerState() {
  const [open, setOpen] = useState(false);

  const toggle = useMemo(() => () => setOpen((prev) => !prev), []);
  const onOpen = useMemo(() => () => setOpen(true), []);
  const onClose = useMemo(() => () => setOpen(false), []);

  return {
    open,
    toggle,
    setOpen,
    onOpen,
    onClose,
  };
}
