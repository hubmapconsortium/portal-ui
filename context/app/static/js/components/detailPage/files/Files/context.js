import React, { useContext } from 'react';

// Stores the endpoints, `uuid`, and `hubmap_id` values.
const FilesContext = React.createContext({});

FilesContext.displayName = 'FilesContext';

export { FilesContext };

export const useFilesContext = () => useContext(FilesContext);
