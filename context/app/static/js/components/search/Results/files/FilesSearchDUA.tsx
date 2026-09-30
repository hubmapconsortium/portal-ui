import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { createContext, useContext } from 'js/helpers/context';
import FileBrowserDUA from 'js/components/detailPage/BulkDataTransfer/FileBrowserDUA';

/**
 * Data Use Agreement gate for the files search.
 *
 * The dataset file browser's `FilesContextProvider` cannot be reused: it reads the access level
 * from the Flask entity context, which only exists on a detail page. Here the level comes from
 * each file document instead, so it can vary row to row within one result set.
 *
 * The `localStorage` key matches the detail page's, so an agreement made in either place is
 * honoured in the other.
 */
interface FilesSearchDUAContextType {
  hasAgreed: (accessLevel: string) => boolean;
  requestFile: (href: string, accessLevel: string) => void;
}

const FilesSearchDUAContext = createContext<FilesSearchDUAContextType>('FilesSearchDUAContext');

export const useFilesSearchDUA = () => useContext(FilesSearchDUAContext);

function storageKey(accessLevel: string) {
  return `has_agreed_to_${accessLevel}_DUA`;
}

export function FilesSearchDUAProvider({ children }: PropsWithChildren) {
  // Agreement is per access level, so a public agreement doesn't unlock protected files.
  const [agreedLevels, setAgreedLevels] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<{ href: string; accessLevel: string } | null>(null);

  const hasAgreed = useCallback(
    (accessLevel: string) => agreedLevels.has(accessLevel) || Boolean(localStorage.getItem(storageKey(accessLevel))),
    [agreedLevels],
  );

  const requestFile = useCallback((href: string, accessLevel: string) => {
    setPending({ href, accessLevel });
  }, []);

  const handleAgree = useCallback(() => {
    if (!pending) return;
    localStorage.setItem(storageKey(pending.accessLevel), 'true');
    setAgreedLevels((levels) => new Set([...levels, pending.accessLevel]));
    window.open(pending.href, '_blank');
    setPending(null);
  }, [pending]);

  const handleClose = useCallback(() => {
    setPending(null);
  }, []);

  const value = useMemo(() => ({ hasAgreed, requestFile }), [hasAgreed, requestFile]);

  return (
    <FilesSearchDUAContext.Provider value={value}>
      {children}
      <FileBrowserDUA
        isOpen={Boolean(pending)}
        handleAgree={handleAgree}
        handleClose={handleClose}
        mapped_data_access_level={pending?.accessLevel ?? 'public'}
      />
    </FilesSearchDUAContext.Provider>
  );
}
