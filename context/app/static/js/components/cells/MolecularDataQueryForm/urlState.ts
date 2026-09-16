import { useEffect, useState } from 'react';
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { stringToAutocompleteObject } from './AutocompleteEntity/utils';
import { AutocompleteResult } from './AutocompleteEntity/types';
import { MolecularDataQueryFormState } from './types';

/**
 * Lists are joined with `|` rather than the usual comma because CL cell type labels can contain
 * commas. The dataset search page solves the same problem with repeated params
 * (`genes=A&genes=B`, see js/components/search/searchParams.ts), which nuqs cannot produce -- so
 * links are NOT interchangeable between the two pages.
 */
const LIST_SEPARATOR = '|';

const parseAsList = parseAsArrayOf(parseAsString, LIST_SEPARATOR);

export const queryParsers = {
  genes: parseAsList,
  cell_types: parseAsList,
  modality: parseAsStringLiteral(['ATAC'] as const),
  pathway: parseAsString,
};

export type QueryParams = {
  genes: string[] | null;
  cell_types: string[] | null;
  modality: 'ATAC' | null;
  pathway: string | null;
};

function toAutocompleteResults(names: string[]): AutocompleteResult[] {
  return names.map((name) => stringToAutocompleteObject(name)).filter(Boolean) as AutocompleteResult[];
}

/**
 * Reads the same params as {@link queryParsers}, but straight from a search string. The popstate
 * handler needs this because the ordering of nuqs's own popstate handling relative to ours is not
 * guaranteed -- `window.location` always is.
 */
export function parseSearch(search: string): QueryParams {
  const params = new URLSearchParams(search);
  const list = (key: string) => {
    const value = params.get(key);
    return value ? value.split(LIST_SEPARATOR).filter(Boolean) : null;
  };
  return {
    genes: list('genes'),
    cell_types: list('cell_types'),
    modality: params.get('modality') === 'ATAC' ? 'ATAC' : null,
    pathway: params.get('pathway'),
  };
}

export interface UrlQuerySnapshot {
  initialValues: Partial<MolecularDataQueryFormState>;
  /** Whether the URL described a runnable query, i.e. whether to auto-submit on load. */
  hasQuery: boolean;
  /** The R-HSA code from the URL, if any. Resolving it to a pathway object needs a network fetch. */
  pathwayCode: string | null;
}

export function paramsToInitialValues(params: QueryParams): UrlQuerySnapshot {
  const genes = toAutocompleteResults(params.genes?.filter(Boolean) ?? []);
  // A hand-edited URL carrying both lists is treated as a gene query.
  const cellTypes = genes.length > 0 ? [] : toAutocompleteResults(params.cell_types?.filter(Boolean) ?? []);
  const queryMethod = params.modality === 'ATAC' ? 'scFindATAC' : 'scFind';

  if (genes.length === 0 && cellTypes.length === 0) {
    return { initialValues: {}, hasQuery: false, pathwayCode: null };
  }

  if (genes.length > 0) {
    return {
      initialValues: { queryType: 'gene', queryMethod, genes },
      hasQuery: true,
      pathwayCode: params.pathway ?? null,
    };
  }

  return {
    initialValues: { queryType: 'cell-type', queryMethod, cellTypes },
    hasQuery: true,
    pathwayCode: null,
  };
}

export function formValuesToParams(data: MolecularDataQueryFormState): QueryParams {
  const isGeneQuery = data.queryType === 'gene';
  const names = (isGeneQuery ? data.genes : data.cellTypes).map((entity) => entity.full);
  return {
    genes: isGeneQuery ? names : null,
    cell_types: isGeneQuery ? null : names,
    modality: data.queryMethod === 'scFindATAC' ? 'ATAC' : null,
    pathway: (isGeneQuery && data.pathway?.values?.[0]) || null,
  };
}

/**
 * Two-way binding between the query form and the URL, so a search can be shared as a link and
 * walked with the browser's back and forward buttons.
 *
 * The snapshot is re-read only on history navigation, never on our own writes. Running a query
 * pushes the URL; if that fed back into `initialValues` it would change its identity, re-fire
 * MolecularDataQueryFormProvider's reset effect (which has `initialValues` in its deps), and
 * reset the form the user just submitted. `popstate` fires for back/forward but not for
 * pushState, so listening to it isolates the two cleanly.
 *
 * `formKey` increments on each history navigation. The caller remounts the form provider with it
 * rather than patching the live form, so a restored URL runs through exactly the same hydration
 * path as a cold page load.
 */
export function useMolecularDataQueryUrlState() {
  const [params, setQueryParams] = useQueryStates(queryParsers);
  const [snapshot, setSnapshot] = useState(() => ({ ...paramsToInitialValues(params), formKey: 0 }));

  useEffect(() => {
    const restoreFromUrl = () => {
      setSnapshot((previous) => ({
        ...paramsToInitialValues(parseSearch(window.location.search)),
        formKey: previous.formKey + 1,
      }));
    };
    window.addEventListener('popstate', restoreFromUrl);
    return () => window.removeEventListener('popstate', restoreFromUrl);
  }, []);

  return { ...snapshot, setQueryParams };
}
