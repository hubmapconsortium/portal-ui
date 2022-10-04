import { useRef } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';

function useTableHeadHeight() {
  const tableHeadRef = useRef(null);
  const { height: tableHeadHeight } = useResizeObserver({ ref: tableHeadRef });

  return { tableHeadRef, tableHeadHeight };
}

export { useTableHeadHeight };
