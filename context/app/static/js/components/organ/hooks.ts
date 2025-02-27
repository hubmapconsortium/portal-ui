import useSWR from 'swr';
import { useAppContext } from 'js/components/Contexts';
import { OrganDataProducts } from 'js/components/organ/types';

function useDataProducts(organName: string) {
  const { dataProductsEndpoint } = useAppContext();
  const dataProductsUrl = `${dataProductsEndpoint}/api/data_products/${organName}`;

  const fetcher = async ({
    url,
    requestInit,
  }: {
    url: string;
    requestInit: RequestInit;
  }): Promise<OrganDataProducts[]> => {
    const response = await fetch(url, requestInit);
    if (!response.ok) throw new Error('Failed to fetch data products');
    return response.json() as Promise<OrganDataProducts[]>;
  };

  const { data } = useSWR<OrganDataProducts[]>(dataProductsUrl, (url: string) =>
    fetcher({
      url,
      requestInit: { headers: { 'Content-type': 'application/json', Accept: 'application/json' } },
    }),
  );

  const dataProducts = data ?? [];

  const dataProductsWithUUIDs = dataProducts.map((product) => {
    const datasetUUIDs = product.dataSets.map((dataset) => dataset.uuid);
    return { ...product, datasetUUIDs };
  });

  return { dataProducts: dataProductsWithUUIDs };
}

export { useDataProducts };
