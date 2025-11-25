import { useEffect, useState } from 'react';

// Returns a boolean that is set to true if the passed condition is ever not falsy
function useStickyToggle(toggleCondition?: unknown) {
  const [hasBeenToggled, setHasBeenToggled] = useState(false);

  useEffect(() => {
    if (toggleCondition) {
      setHasBeenToggled(true);
    }
  }, [toggleCondition]);

  return hasBeenToggled;
}

export default useStickyToggle;
