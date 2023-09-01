import { createContext, useContext } from 'js/helpers/context';
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useDetailContext } from '../DetailContext';
import FileBrowserDUA from '../BulkDataTransfer/FileBrowserDUA';

// Either a URL to open in a new tab or a function to call when the user agrees to the DUA
// This function needs to be wrapped in an object because passing a raw function was causing
// it to run immediately instead of when the user clicked the agree button.
type OnDUAAgree = string | { handleAgree: () => void };

type FilesContextType = {
  openDUA: (onAgree: OnDUAAgree) => void;
  hasAgreedToDUA: boolean;
};

const FilesContext = createContext<FilesContextType>('FilesContext');

FilesContext.displayName = 'FilesContext';

export { FilesContext };

export const useFilesContext = () => useContext(FilesContext);

export function FilesContextProvider({ children }: PropsWithChildren) {
  const { mapped_data_access_level } = useDetailContext();

  const localStorageKey = `has_agreed_to_${mapped_data_access_level}_DUA`;
  const [hasAgreedToDUA, agreeToDUA] = useState<boolean>(Boolean(localStorage.getItem(localStorageKey)));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [onDUAAgree, setOnDUAAgree] = useState<OnDUAAgree>('');

  const handleDUAAgree = useCallback(() => {
    agreeToDUA(true);
    localStorage.setItem(localStorageKey, 'true');
    setDialogOpen(false);
    if (typeof onDUAAgree === 'string') {
      window.open(onDUAAgree, '_blank');
    } else {
      onDUAAgree.handleAgree();
    }
  }, [agreeToDUA, localStorageKey, setDialogOpen, onDUAAgree]);

  const handleDUAClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const openDUA = useCallback((onAgree: OnDUAAgree) => {
    setDialogOpen(true);
    setOnDUAAgree(onAgree);
  }, []);

  const filesContext = useMemo(() => ({ openDUA, hasAgreedToDUA }), [openDUA, hasAgreedToDUA]);

  return (
    <FilesContext.Provider value={filesContext}>
      {children}
      <FileBrowserDUA
        isOpen={isDialogOpen}
        handleAgree={handleDUAAgree}
        handleClose={handleDUAClose}
        mapped_data_access_level={mapped_data_access_level}
      />
    </FilesContext.Provider>
  );
}
