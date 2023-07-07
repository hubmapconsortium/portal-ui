import React, { useContext } from 'react';

const FlaskDataContext = React.createContext({});
const AppContext = React.createContext({});
const FilesContext = React.createContext({});
const DetailContext = React.createContext({});

FlaskDataContext.displayName = 'FlaskDataContext';
AppContext.displayName = 'AppContext';
FilesContext.displayName = 'FilesContext';
DetailContext.displayName = 'DetailContext';

export { FlaskDataContext, AppContext, FilesContext, DetailContext };

export const useAppContext = () => useContext(AppContext);
export const useFlaskDataContext = () => useContext(FlaskDataContext);
export const useFilesContext = () => useContext(FilesContext);
export const useDetailContext = () => useContext(DetailContext);
