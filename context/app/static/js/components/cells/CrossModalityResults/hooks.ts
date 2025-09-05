import useSWRImmutable from 'swr/immutable';
import useSWR from 'swr';
import { SWRError } from 'js/helpers/swr/errors';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
import { useEffect } from 'react';
import CellsService, {
  DatasetsSelectedByExpressionResponse,
  GetDatasetsProps,
  GetDatasetsResponse,
} from '../CellsService';
import { extractCLID } from './utils';
import { useCrossModalityQueryParameters } from '../MolecularDataQueryForm/hooks';
import { QueryType } from '../queryTypes';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';

const fetchCellTypeNames = async (cellName: string) => {
  return new CellsService().getAllNamesForCellType(cellName);
};

interface UnwrappedResponse {
  list: DatasetsSelectedByExpressionResponse[];
  length: number;
}

function unwrapResults<T extends QueryType>(results: GetDatasetsResponse<T> | undefined): UnwrappedResponse {
  if (!results) {
    return { list: [], length: 0 };
  }
  if ('list' in results) {
    return { ...results, length: results.list.length };
  }
  return { list: results, length: results.length };
}

const fetchCrossModalityResults = async <T extends QueryType>(params: GetDatasetsProps<T>) => {
  const results = await new CellsService().getDatasets(params);
  return unwrapResults(results);
};

export function useAllCellTypeNames(cellName: string) {
  const { data: cellTypeNames, error, isLoading } = useSWRImmutable<string[], SWRError>(cellName, fetchCellTypeNames);

  return {
    cellTypeNames,
    error,
    isLoading,
  };
}

export function useCellTypeOrgans(cellName: string) {
  const clid = extractCLID(cellName) ?? cellName;
  const results = useFeatureDetails('cell-types', clid);
  return { organs: results.data?.organs, ...results };
}

export function useCrossModalityResults<T extends QueryType>() {
  const parameters = useCrossModalityQueryParameters<T>();
  const { data, isLoading, error, ...swr } = useSWR<UnwrappedResponse, Error, GetDatasetsProps<T>>(
    parameters,
    fetchCrossModalityResults,
  );

  const { setResults } = useResultsProvider();

  useEffect(() => {
    setResults(data?.length ?? 0, isLoading, error);
  }, [data, setResults, isLoading, error]);

  return { ...swr, parameters, data, isLoading, error };
}
