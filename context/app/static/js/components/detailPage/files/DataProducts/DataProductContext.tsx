import { createContext, useContext } from 'js/helpers/context';

type DataProductUUID = string;

const DataProductContext = createContext<DataProductUUID>('DataProductContext');

export const DataProductProvider = DataProductContext.Provider;

export const useDataProductContext = () => useContext(DataProductContext);
