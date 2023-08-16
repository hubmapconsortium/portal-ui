import { createContext, useContext } from 'js/helpers/context';

type FilesContextType = {
  openDUA: (linkURL: string) => void;
  hasAgreedToDUA: boolean;
};

const FilesContext = createContext<FilesContextType>('FilesContext');

FilesContext.displayName = 'FilesContext';

export { FilesContext };

export const useFilesContext = () => useContext(FilesContext);
