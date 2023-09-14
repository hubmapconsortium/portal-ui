import { createContext, useContext } from 'js/helpers/context';

interface DetailContextType {
  uuid: string;
  hubmap_id: string;
  // Currently set from real data on Dataset pages,
  // defaults to `Public` on publication pages
  mapped_data_access_level: string;
}

export const DetailContext = createContext<DetailContextType>('DetailContext');

export const useDetailContext = () => useContext(DetailContext);
