import React, { useContext } from 'react';

// Stores the endpoints, `uuid`, and `hubmap_id` values.
const DetailContext = React.createContext({});

DetailContext.displayName = 'DetailContext';

export default DetailContext;

export const useDetailContext = () => useContext(DetailContext);
