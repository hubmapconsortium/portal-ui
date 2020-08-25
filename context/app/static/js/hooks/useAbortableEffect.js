// https://www.debuggr.io/react-update-unmounted-component/
// https://github.com/reactjs/rfcs/issues/137
import { useEffect } from 'react';

function useAbortableEffect(effect, dependencies) {
  const status = {}; // mutable status object
  useEffect(() => {
    status.aborted = false;
    // pass the mutuable object to the effect callback
    // store the returned value for cleanup
    const cleanUpFn = effect(status);
    return () => {
      // mutate the object to signal the consumer this effect is cleaning up
      status.aborted = true;
      if (typeof cleanUpFn === 'function') {
        // run the cleanup function
        cleanUpFn();
      }
    };
    // not the best way to pass dependencies, but what other options do we have
  }, [...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps
}

export default useAbortableEffect;
