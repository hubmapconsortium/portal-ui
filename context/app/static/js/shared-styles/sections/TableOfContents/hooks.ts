import React from 'react';
import { throttle } from 'js/helpers/functions';

function useThrottledOnScroll(callback: (() => void) | null, delay: number) {
  const throttledCallback = React.useMemo(() => (callback ? throttle(callback, delay) : null), [callback, delay]);

  React.useEffect(() => {
    if (throttledCallback === null) {
      return undefined;
    }

    window.addEventListener('scroll', throttledCallback);
    return () => {
      window.removeEventListener('scroll', throttledCallback);
    };
  }, [throttledCallback]);
}

export { useThrottledOnScroll };
