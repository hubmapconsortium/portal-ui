import React, { useContext } from 'react';

// const AppContext = React.createContext({});
const FlaskDataContext = React.createContext({});

FlaskDataContext.displayName = 'FlaskDataContext';

// export { AppContext };
export { FlaskDataContext };
export const useFlaskDataContext = () => useContext(FlaskDataContext);
