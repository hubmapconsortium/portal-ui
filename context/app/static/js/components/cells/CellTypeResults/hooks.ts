import useSWR from 'swr/immutable';
import { SWRError } from 'js/helpers/swr/errors';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
import CellsService from '../CellsService';
import { extractCLID } from './utils';

const fetchCellTypeNames = async (cellName: string) => {
  return new CellsService().getAllNamesForCellType(cellName);
};

export function useAllCellTypeNames(cellName: string) {
  const { data: cellTypeNames, error, isLoading } = useSWR<string[], SWRError>(cellName, fetchCellTypeNames);

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
