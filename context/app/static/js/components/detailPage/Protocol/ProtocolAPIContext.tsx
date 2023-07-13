import { createContext, useContext } from 'react';

type ProtocolAPIContextType = {
  clientId: string;
  clientAuthToken: string;
};

export const ProtocolAPIContext = createContext<ProtocolAPIContextType | null>(null);

export const useProtocolAPIContext = () => useContext(ProtocolAPIContext);
