import LZString from 'lz-string';
import { createSerializer, parseAsArrayOf, parseAsString } from 'nuqs';
import type { SCFindParams } from '../organ/utils';
import { parseURLState } from './store';
import type { SearchURLState } from './store';

/**
 * Mapping from Elasticsearch field name to human-readable URL parameter name.
 * To add a new readable param, add one entry here and one to readableParamsSchema below.
 */
export const READABLE_PARAM_FIELDS = {
  origin_samples_unique_mapped_organs: 'organ',
  analyte_class: 'analyte',
  raw_dataset_type: 'dataset_type',
  mapped_status: 'status',
} as const;

export const HIERARCHICAL_FIELDS = ['raw_dataset_type', 'mapped_status'] as const;

export const isHierarchicalField = (field: string): field is (typeof HIERARCHICAL_FIELDS)[number] => {
  return HIERARCHICAL_FIELDS.includes(field as (typeof HIERARCHICAL_FIELDS)[number]);
};

type ReadableParamField = keyof typeof READABLE_PARAM_FIELDS;
type ReadableParamName = (typeof READABLE_PARAM_FIELDS)[ReadableParamField];

/** Reverse mapping: URL param name → ES field name */
export const PARAM_TO_FIELD = Object.fromEntries(
  (Object.entries(READABLE_PARAM_FIELDS) as [ReadableParamField, ReadableParamName][]).map(([field, param]) => [
    param,
    field,
  ]),
) as Record<ReadableParamName, ReadableParamField>;

export const readableParamsSchema = {
  organ: parseAsArrayOf(parseAsString).withDefault([]),
  analyte: parseAsArrayOf(parseAsString).withDefault([]),
  dataset_type: parseAsArrayOf(parseAsString).withDefault([]),
  status: parseAsArrayOf(parseAsString).withDefault([]),
  q: parseAsString,
};

export const serializeReadableParams = createSerializer(readableParamsSchema);

/** URL param name for the scFind "indexed datasets only" flag. */
const SCFIND_ONLY_PARAM = 'scfind';
/** URL param name for scFind gene queries (repeated, e.g. `genes=CD4&genes=CD8A`). */
const GENES_PARAM = 'genes';
/** URL param name for scFind cell-type queries (repeated; values may contain commas). */
const CELL_TYPES_PARAM = 'cell_types';
/** URL param name for an integrated map's data product ID. */
const DATA_PRODUCT_PARAM = 'data_product';

/**
 * Encodes scFind query params and a data product ID as their own readable URL params, rather than
 * folding them into the opaque compressed `q` blob. Gene and cell-type lists use repeated params
 * (e.g. `genes=A&genes=B`) so that values containing commas — like some CL cell-type labels —
 * survive the round-trip, since comma-joined params are split on commas when parsed.
 *
 * Returns a `URLSearchParams` suitable for passing as the base to `serializeReadableParams`.
 */
export function buildScFindAndDataProductParams({
  scFindParams,
  dataProductID,
}: {
  scFindParams?: SCFindParams;
  dataProductID?: string;
}): URLSearchParams {
  const params = new URLSearchParams();
  if (scFindParams?.scFindOnly) {
    params.set(SCFIND_ONLY_PARAM, 'true');
  }
  (scFindParams?.genes ?? []).forEach((gene) => params.append(GENES_PARAM, gene));
  (scFindParams?.cellTypes ?? []).forEach((cellType) => params.append(CELL_TYPES_PARAM, cellType));
  if (dataProductID) {
    params.set(DATA_PRODUCT_PARAM, dataProductID);
  }
  return params;
}

/**
 * Reads the scFind / data product readable params produced by {@link buildScFindAndDataProductParams}.
 * Uses `getAll` without comma-splitting so comma-containing cell-type names are preserved.
 */
export function parseScFindAndDataProductParams(params: URLSearchParams): {
  scFindParams?: SCFindParams;
  dataProductID?: string;
} {
  const genes = params.getAll(GENES_PARAM).filter(Boolean);
  const cellTypes = params.getAll(CELL_TYPES_PARAM).filter(Boolean);
  const scFindOnly = params.get(SCFIND_ONLY_PARAM) === 'true';
  const dataProduct = params.get(DATA_PRODUCT_PARAM);

  const scFindParams: SCFindParams = {};
  if (scFindOnly) scFindParams.scFindOnly = true;
  if (genes.length > 0) scFindParams.genes = genes;
  if (cellTypes.length > 0) scFindParams.cellTypes = cellTypes;

  return {
    ...(Object.keys(scFindParams).length > 0 && { scFindParams }),
    ...(dataProduct && { dataProductID: dataProduct }),
  };
}

/**
 * Encodes a hierarchical filter's values map into dot-notation URL param strings.
 *
 * `{ CODEX: Set(['assay1', 'assay2']) }` → `['CODEX.assay1', 'CODEX.assay2']`
 * `{ CODEX: Set([]) }` → `['CODEX']`  (edge case: parent with no children)
 */
export function encodeHierarchical(values: Record<string, Set<string>>): string[] {
  return Object.entries(values).flatMap(([parent, children]) => {
    if (children.size === 0) {
      return [parent];
    }
    return [...children].map((child) => `${parent}.${child}`);
  });
}

/**
 * Decodes dot-notation URL param strings back to a hierarchical values record.
 *
 * `['CODEX.assay1', 'CODEX.assay2']` → `{ CODEX: ['assay1', 'assay2'] }`
 * `['CODEX']` → `{ CODEX: [] }`  (parent-only: children not pre-specified)
 */
export function decodeHierarchical(values: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const value of values) {
    const dotIdx = value.indexOf('.');
    if (dotIdx === -1) {
      if (!result[value]) result[value] = [];
    } else {
      const parent = value.slice(0, dotIdx);
      const child = value.slice(dotIdx + 1);
      if (!result[parent]) result[parent] = [];
      result[parent].push(child);
    }
  }
  return result;
}

/**
 * Returns true if the query string (including leading `?`) looks like a legacy
 * single-blob LZString-compressed URL. The old format had no `=` in the query string
 * because the entire string was a raw compressed value, not a key=value pair.
 */
export function isLegacyCompressedURL(search: string): boolean {
  if (!search || search === '?') return false;
  const raw = search.startsWith('?') ? search.slice(1) : search;
  return !raw.includes('=');
}

/**
 * Parses a new-format query string (named params + optional compressed `q`) into
 * a partial SearchURLState suitable for merging with the default store state.
 */
export function parseReadableParams(search: string): Partial<SearchURLState> {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

  const filters: SearchURLState['filters'] = {};

  // Process each readable param
  (Object.entries(READABLE_PARAM_FIELDS) as [ReadableParamField, ReadableParamName][]).forEach(([field, param]) => {
    // nuqs serializes arrays as comma-separated values in a single param (e.g., "a,b,c"),
    // but URLs may also use repeated params (e.g., "organ=Kidney&organ=Liver").
    // Handle both by collecting all param instances and splitting each on commas.
    const rawValues = params.getAll(param);
    const values = rawValues.flatMap((v) => v.split(',').filter(Boolean));
    if (values.length === 0) return;

    // Determine the facet type based on the field
    // raw_dataset_type and mapped_status are HIERARCHICAL; others are TERM
    if (isHierarchicalField(field)) {
      const decoded = decodeHierarchical(values);
      filters[field] = { type: 'HIERARCHICAL', values: decoded };
    } else {
      filters[field] = { type: 'TERM', values };
    }
  });

  // Parse the compressed `q` param for remaining state
  const q = params.get('q');
  let remainingState: Partial<SearchURLState> = {};
  if (q) {
    const decompressed = LZString.decompressFromEncodedURIComponent(q);
    if (decompressed) {
      remainingState = parseURLState(decompressed);
    }
  }

  // Merge: readable filters take precedence; remaining filters from q are merged in
  const mergedFilters = {
    ...(remainingState.filters ?? {}),
    ...filters,
  };

  // scFind / data product readable params take precedence over any legacy values from the `q` blob.
  const { scFindParams, dataProductID } = parseScFindAndDataProductParams(params);

  return {
    ...remainingState,
    filters: mergedFilters,
    ...(scFindParams && { scFindParams }),
    ...(dataProductID && { dataProductID }),
  };
}
