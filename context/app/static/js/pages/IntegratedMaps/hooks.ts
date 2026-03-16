import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr/fetchers';
import { useAppContext } from 'js/components/Contexts';
import { OrganDataProducts } from 'js/components/organ/types';

function keepLatestVersions(products: OrganDataProducts[]): OrganDataProducts[] {
  const latest = new Map<string, OrganDataProducts>();
  for (const p of products) {
    const key = `${p.tissue.tissuetype}\0${p.assay.assayName}`;
    const existing = latest.get(key);
    if (!existing || p.creation_time > existing.creation_time) {
      latest.set(key, p);
    }
  }
  return [...latest.values()];
}

export function useAllDataProducts() {
  const { dataProductsEndpoint } = useAppContext();

  const { data, isLoading } = useSWR<OrganDataProducts[]>(
    `${dataProductsEndpoint}/api/data_products/`,
    (url: string) => fetcher<OrganDataProducts[]>({ url }),
    { fallbackData: [] },
  );

  const dataProducts = useMemo(
    () => keepLatestVersions(data ?? []).map((p) => ({ ...p, datasetUUIDs: p.dataSets.map((d) => d.uuid) })),
    [data],
  );

  return { dataProducts, isLoading };
}
