import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

export interface DatasetsForGenesResponse {
  findDatasets: Record<string, string[]>;
}

export interface DatasetsForGenesParams {
  geneList: string | string[];
}

type DatasetsForGenesKey = string;

export function createFindDatasetForGenesKey(
  scFindEndpoint: string,
  { geneList }: DatasetsForGenesParams,
): DatasetsForGenesKey {
  return createScFindKey(scFindEndpoint, 'findDatasets', {
    gene_list: Array.isArray(geneList) ? geneList.join(',') : geneList,
  });
}

export default function useFindDatasetForGenes(props: DatasetsForGenesParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createFindDatasetForGenesKey(scFindEndpoint, props);
  return useSWR<DatasetsForGenesResponse, Error, DatasetsForGenesKey>(
    key,
    (url) =>
      fetcher({
        url,
        errorMessages: {
          400: `No results found for ${Array.isArray(props.geneList) ? props.geneList.join(', ') : props.geneList}`,
        },
      }),
    {
      shouldRetryOnError: false,
    },
  );
}
