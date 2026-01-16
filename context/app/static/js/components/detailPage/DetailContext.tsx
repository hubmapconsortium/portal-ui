import React, { PropsWithChildren, useMemo } from 'react';

import { createContext, useContext } from 'js/helpers/context';

interface DetailContextType {
  uuid: string;
  hubmap_id: string;
  // Currently set from real data on Dataset pages,
  // defaults to `Public` on publication pages
  mapped_data_access_level: string;
  entityType: string;
}

type Props = PropsWithChildren<
  Omit<DetailContextType, 'entityType'> & {
    entityType?: string;
  }
>;

export const DetailContext = createContext<DetailContextType>('DetailContext');

export const useDetailContext = () => useContext(DetailContext);

export function DetailContextProvider({
  children,
  uuid,
  hubmap_id,
  mapped_data_access_level,
  entityType = 'Dataset',
}: Props) {
  const value = useMemo(() => {
    return {
      uuid,
      hubmap_id,
      mapped_data_access_level,
      entityType,
    };
  }, [uuid, hubmap_id, mapped_data_access_level, entityType]);
  return <DetailContext.Provider value={value}>{children}</DetailContext.Provider>;
}
