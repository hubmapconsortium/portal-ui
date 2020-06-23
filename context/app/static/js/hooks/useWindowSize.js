import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import debounce from 'lodash/debounce';

function useWindowSize() {
  function getDimensions() {
    return {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }
  const [dimensions, setDimensions] = useState(getDimensions);

  useEffect(() => {
    function handleResize() {
      setDimensions(getDimensions());
    }
    const debouncedHandleResize = debounce(handleResize, 500, { trailing: true });

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      debouncedHandleResize.cancel();
    };
  }, []);
  return dimensions;
}

export default useWindowSize;
