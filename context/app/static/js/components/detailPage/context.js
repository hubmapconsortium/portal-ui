import React, { useContext } from 'react';

// Stores the endpoints, `uuid`, and `hubmap_id` values.
const DetailContext = React.createContext({});

DetailContext.displayName = 'DetailContext';

export { DetailContext };

export const useDetailContext = () => useContext(DetailContext);
