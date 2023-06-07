import React, { useContext } from 'react';

const FlaskDataContext = React.createContext({});

FlaskDataContext.displayName = 'FlaskDataContext';

export { FlaskDataContext };
export const useFlaskDataContext = () => useContext(FlaskDataContext);
