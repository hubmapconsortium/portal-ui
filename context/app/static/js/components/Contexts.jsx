import React, { useContext } from 'react';

const FlaskDataContext = React.createContext({});
const AppContext = React.createContext({});

FlaskDataContext.displayName = 'FlaskDataContext';
AppContext.displayName = 'AppContext';

export { FlaskDataContext, AppContext };

export const useFlaskDataContext = () => useContext(FlaskDataContext);
export const useAppContext = () => useContext(AppContext);
