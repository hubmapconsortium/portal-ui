import LZString from 'lz-string';
import { createSerializer, parseAsArrayOf, parseAsString } from 'nuqs';
import type { SCFindParams } from '../organ/utils';
import { isBooleanGroupFilter, parseURLState } from './store';
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
/** URL param name for the scFind modality (e.g. `modality=ATAC`); absent means the default (RNA). */
const MODALITY_PARAM = 'modality';
/** URL param name for the scFind "all modalities" flag (union RNA + ATAC results). */
const ALL_MODALITIES_PARAM = 'all_modalities';
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
  params = new URLSearchParams(),
}: {
  scFindParams?: SCFindParams;
  dataProductID?: string;
  /** Existing params to append into. Defaults to a fresh set. */
  params?: URLSearchParams;
}): URLSearchParams {
  if (scFindParams?.scFindOnly) {
    params.set(SCFIND_ONLY_PARAM, 'true');
  }
  (scFindParams?.genes ?? []).forEach((gene) => params.append(GENES_PARAM, gene));
  (scFindParams?.cellTypes ?? []).forEach((cellType) => params.append(CELL_TYPES_PARAM, cellType));
  if (scFindParams?.modality) {
    params.set(MODALITY_PARAM, scFindParams.modality);
  }
  if (scFindParams?.allModalities) {
    params.set(ALL_MODALITIES_PARAM, 'true');
  }
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
  const modality = params.get(MODALITY_PARAM);
  const allModalities = params.get(ALL_MODALITIES_PARAM) === 'true';
  const dataProduct = params.get(DATA_PRODUCT_PARAM);

  const scFindParams: SCFindParams = {};
  if (scFindOnly) scFindParams.scFindOnly = true;
  if (genes.length > 0) scFindParams.genes = genes;
  if (cellTypes.length > 0) scFindParams.cellTypes = cellTypes;
  if (modality) scFindParams.modality = modality;
  if (allModalities) scFindParams.allModalities = true;

  return {
    ...(Object.keys(scFindParams).length > 0 && { scFindParams }),
    ...(dataProduct && { dataProductID: dataProduct }),
  };
}

/** ES field name of the synthetic "Dataset Features" boolean-group facet. */
export const DATASET_FEATURES_FIELD = '_dataset_features';

/**
 * Mapping from URL param name to `_dataset_features` boolean-group item key, so each Dataset
 * Features checkbox shares as a readable `?visualization=true` param instead of being buried in the
 * opaque compressed `q` blob.
 *
 * Item keys must match `getBooleanGroupItemKey` output for the `_dataset_features` facet items in
 * js/pages/search/S.tsx: `exists` items key on `field`, `term` items on `field::value`. Add an entry
 * here when adding an item there; unmapped keys still round-trip, but only via `q`.
 */
export const DATASET_FEATURE_PARAMS = {
  visualization: 'visualization::true',
  publications: 'descendant_counts.entity_type.Publication',
  cell_annotations: 'calculated_metadata.object_types::CL:0000000',
  spatial: 'spatial',
} as const;

/** Reverse mapping: boolean-group item key → URL param name */
const ITEM_KEY_TO_FEATURE_PARAM: Record<string, string> = Object.fromEntries(
  Object.entries(DATASET_FEATURE_PARAMS).map(([param, itemKey]) => [itemKey, param]),
);

/**
 * Sets a `<feature>=true` param for each mapped boolean-group item key, and returns the keys with no
 * param mapping so callers can keep those in the `q` blob rather than dropping them from the URL.
 */
export function appendDatasetFeatureParams(params: URLSearchParams, itemKeys: Iterable<string>): string[] {
  const unmapped: string[] = [];
  for (const itemKey of itemKeys) {
    const param = ITEM_KEY_TO_FEATURE_PARAM[itemKey];
    if (param) {
      params.set(param, 'true');
    } else {
      unmapped.push(itemKey);
    }
  }
  return unmapped;
}

/** Reads the params produced by {@link appendDatasetFeatureParams} back into boolean-group item keys. */
export function parseDatasetFeatureParams(params: URLSearchParams): string[] {
  return Object.entries(DATASET_FEATURE_PARAMS)
    .filter(([param]) => params.get(param) === 'true')
    .map(([, itemKey]) => itemKey);
}

/** Every URL param the search state owns and rewrites whenever the query changes. */
const SEARCH_OWNED_PARAMS: string[] = [
  ...Object.values(READABLE_PARAM_FIELDS),
  'q',
  SCFIND_ONLY_PARAM,
  GENES_PARAM,
  CELL_TYPES_PARAM,
  MODALITY_PARAM,
  ALL_MODALITIES_PARAM,
  DATA_PRODUCT_PARAM,
  ...Object.keys(DATASET_FEATURE_PARAMS),
];

/**
 * Returns the params on the current URL that the search state does *not* own, to serialize the fresh
 * search params into. The search state rewrites the whole query string whenever a filter changes, so
 * without this any unrelated param — such as `mode=say-see` from useSearchMode — would be dropped on
 * the first facet interaction.
 */
export function preserveUnownedParams(search: string): URLSearchParams {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  SEARCH_OWNED_PARAMS.forEach((param) => params.delete(param));
  return params;
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

  // Dataset-feature params union with any `_dataset_features` values already decoded from `q`,
  // rather than replacing them, so item keys without a readable param survive alongside.
  const featureItemKeys = parseDatasetFeatureParams(params);
  if (featureItemKeys.length > 0) {
    const fromQ = mergedFilters[DATASET_FEATURES_FIELD];
    const qValues = fromQ && isBooleanGroupFilter<string[]>(fromQ) ? fromQ.values : [];
    mergedFilters[DATASET_FEATURES_FIELD] = {
      type: 'BOOLEAN_GROUP',
      values: [...new Set([...qValues, ...featureItemKeys])],
    };
  }

  // scFind / data product readable params take precedence over any legacy values from the `q` blob.
  const { scFindParams, dataProductID } = parseScFindAndDataProductParams(params);

  return {
    ...remainingState,
    filters: mergedFilters,
    ...(scFindParams && { scFindParams }),
    ...(dataProductID && { dataProductID }),
  };
}
