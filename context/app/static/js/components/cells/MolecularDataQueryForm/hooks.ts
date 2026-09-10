import { queryTypes } from 'js/components/cells/queryTypes';
import { useFormContext } from 'react-hook-form';
import { MolecularDataQueryFormState, SCFindModality } from './types';
import { AutocompleteResult } from './AutocompleteEntity/types';

export function getScFindModality(queryMethod: string): SCFindModality {
  return queryMethod === 'scFindATAC' ? 'ATAC' : undefined;
}

export function makeScFindModalityLabel(modality: SCFindModality): string {
  return modality === 'ATAC' ? 'ATACseq' : 'RNAseq';
}

export function getScFindModalityLabel(queryMethod: string): string {
  const modality = getScFindModality(queryMethod);
  return makeScFindModalityLabel(modality);
}

export function getCellVariableNames(queryType: string, genes: AutocompleteResult[], cellTypes: AutocompleteResult[]) {
  switch (queryType) {
    case 'gene':
      return genes.map((g) => g.full);
    case 'cell-type':
      return cellTypes.map((c) => c.full);
    default:
      return [];
  }
}

export function useCellVariableNames() {
  const { watch } = useFormContext<MolecularDataQueryFormState>();
  return getCellVariableNames(watch('queryType'), watch('genes'), watch('cellTypes'));
}

export function useQueryType() {
  const { watch } = useFormContext<MolecularDataQueryFormState>();
  const queryType = watch('queryType');
  return queryTypes[queryType];
}

export function useIsQueryType(type: 'gene' | 'cell-type') {
  const { watch } = useFormContext<MolecularDataQueryFormState>();
  return watch('queryType') === type;
}

export function useMolecularDataQueryFormState() {
  return useFormContext<MolecularDataQueryFormState>();
}
