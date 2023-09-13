import { useState, useEffect } from 'react';
import { debounce } from 'js/helpers/nodash';

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

      // ensure debounced func is not run for unmounted component
      debouncedHandleResize.cancel();
    };
  }, []);
  return dimensions;
}

export default useWindowSize;
