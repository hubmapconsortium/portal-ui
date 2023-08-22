import { createContext, useContext } from 'js/helpers/context';

type DetailContextType = {
  uuid: string;
  hubmap_id: string;
  // Currently only on Dataset pages
  mapped_data_access_level?: string;
};

export const DetailContext = createContext<DetailContextType>('DetailContext');

export const useDetailContext = () => useContext(DetailContext);
