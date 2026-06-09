import { useMemo } from 'react';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr/fetchers';
import { SWRError } from 'js/helpers/swr/errors';
import { useAppContext } from 'js/components/Contexts';
import { OrganDataProducts } from 'js/components/organ/types';

/**
 * Fetches a single data product by its `data_product_id` and exposes the UUIDs of
 * its contributing datasets. Used by the search page to resolve a `data_product_id`
 * URL parameter into a `uuid` filter without embedding every UUID in the link.
 *
 * @param dataProductID The data product's `data_product_id`. When undefined, no request is made.
 */
export default function useDataProduct(dataProductID?: string) {
  const { dataProductsEndpoint } = useAppContext();

  // The single-product endpoint requires a trailing slash; without it the API responds with a redirect.
  const url = dataProductID ? `${dataProductsEndpoint}/api/data_products/${dataProductID}/` : null;

  const { data, isLoading, error } = useSWR<OrganDataProducts, SWRError, string | null>(url, (u: string) =>
    fetcher<OrganDataProducts>({ url: u }),
  );

  const datasetUUIDs = useMemo(
    () => [...new Set((data?.dataSets ?? []).map((dataset) => dataset.uuid).filter(Boolean))],
    [data],
  );

  return { dataProduct: data, datasetUUIDs, isLoading, error };
}
