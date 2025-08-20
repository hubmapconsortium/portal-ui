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

const fetchCrossModalityResults = async <T extends QueryType>(params: GetDatasetsProps<T>) => {
  return new CellsService().getDatasets(params);
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

function unwrapResults<T extends QueryType>(
  results: GetDatasetsResponse<T> | undefined,
): {
  list: DatasetsSelectedByExpressionResponse[];
  length: number;
} {
  if (!results) {
    return { list: [], length: 0 };
  }
  if ('list' in results) {
    return { ...results, length: results.list.length };
  }
  return { list: results, length: results.length };
}

export function useCrossModalityResults<T extends QueryType>() {
  const parameters = useCrossModalityQueryParameters<T>();
  const { data, isLoading, error, ...swr } = useSWR<GetDatasetsResponse<T>, Error, GetDatasetsProps<T>>(
    parameters,
    fetchCrossModalityResults,
  );

  const unwrappedResults = unwrapResults(data);

  const { setResults } = useResultsProvider();

  useEffect(() => {
    setResults(unwrappedResults.length, isLoading, error);
  }, [unwrappedResults, setResults, isLoading, error]);

  return { ...swr, parameters, data: unwrappedResults, isLoading, error };
}
