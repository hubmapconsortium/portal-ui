import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr/fetchers';
import { useAppContext } from 'js/components/Contexts';
import { OrganDataProducts } from 'js/components/organ/types';

export function useAllDataProducts() {
  const { dataProductsEndpoint } = useAppContext();

  const { data, isLoading } = useSWR<OrganDataProducts[]>(
    `${dataProductsEndpoint}/api/data_products/`,
    (url: string) => fetcher<OrganDataProducts[]>({ url }),
    { fallbackData: [] },
  );

  return {
    dataProducts: (data ?? []).map((p) => ({ ...p, datasetUUIDs: p.dataSets.map((d) => d.uuid) })),
    isLoading,
  };
}
