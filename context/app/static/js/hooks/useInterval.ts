import { useRef, useEffect } from 'react';

// Discussed in https://overreacted.io/making-setinterval-declarative-with-react-hooks/ by Dan Abramov.
function useInterval(callback: () => unknown, delay: number) {
  const savedCallback = useRef<() => unknown>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
