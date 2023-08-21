import { createContext, useContext } from 'js/helpers/context';
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { useDetailContext } from '../DetailContext';
import FileBrowserDUA from '../BulkDataTransfer/FileBrowserDUA';

type FilesContextType = {
  openDUA: (linkURL: string) => void;
  hasAgreedToDUA: boolean;
};

const FilesContext = createContext<FilesContextType>('FilesContext');

FilesContext.displayName = 'FilesContext';

export { FilesContext };

export const useFilesContext = () => useContext(FilesContext);

export function FilesContextProvider({ children }: PropsWithChildren) {
  const { mapped_data_access_level } = useDetailContext();

  if (!mapped_data_access_level) {
    throw new Error('Data access level information was not found.');
  }

  const localStorageKey = `has_agreed_to_${mapped_data_access_level}_DUA`;
  const [hasAgreedToDUA, agreeToDUA] = useState<boolean>(Boolean(localStorage.getItem(localStorageKey)));
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [urlClickedBeforeDUA, setUrlClickedBeforeDUA] = useState('');

  const handleDUAAgree = useCallback(() => {
    agreeToDUA(true);
    localStorage.setItem(localStorageKey, 'true');
    setDialogOpen(false);
    window.open(urlClickedBeforeDUA, '_blank');
  }, [agreeToDUA, localStorageKey, setDialogOpen, urlClickedBeforeDUA]);

  const handleDUAClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const openDUA = useCallback((linkUrl) => {
    setDialogOpen(true);
    setUrlClickedBeforeDUA(linkUrl);
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
