import React, { useState } from 'react';

export function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  const hashChangeHandler = React.useCallback(() => {
    setHash(window.location.hash);
  }, []);

  React.useEffect(() => {
    window.addEventListener('hashchange', hashChangeHandler);
    window.addEventListener('popstate', hashChangeHandler);
    return () => {
      window.removeEventListener('hashchange', hashChangeHandler);
      window.removeEventListener('popstate', hashChangeHandler);
    };
  }, [hashChangeHandler]);

  const updateHash = React.useCallback(
    (newHash: string) => {
      if (newHash !== hash) window.location.hash = newHash;
    },
    [hash],
  );

  return [hash, updateHash] as const;
}
