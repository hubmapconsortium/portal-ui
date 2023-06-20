import React, { useContext } from 'react';

const FlaskDataContext = React.createContext({});
const AppContext = React.createContext({});

FlaskDataContext.displayName = 'FlaskDataContext';

export { FlaskDataContext, AppContext };
export const useAppContext = () => useContext(AppContext);
export const useFlaskDataContext = () => useContext(FlaskDataContext);
