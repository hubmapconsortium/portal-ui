import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

type DatasetsForGenesResponse = Record<string, string[]>;

export interface DatasetsForGenesParams {
  geneList: string[];
}

type DatasetsForGenesKey = string;

export function createCellTypeMarkersKey(
  scFindEndpoint: string,
  { geneList }: DatasetsForGenesParams,
): DatasetsForGenesKey {
  return createScFindKey(scFindEndpoint, 'findDatasets', {
    gene_list: geneList.join(','),
  });
}

export default function useCellTypeMarkers(props: DatasetsForGenesParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCellTypeMarkersKey(scFindEndpoint, props);
  return useSWR<DatasetsForGenesResponse, unknown, DatasetsForGenesKey>(key, (url) => fetcher({ url }));
}
