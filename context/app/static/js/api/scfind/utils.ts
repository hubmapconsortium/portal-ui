import { useAppContext } from 'js/components/Contexts';
import { fetcher, multiFetcher, MultiFetchOptionsType } from 'js/helpers/swr';

// NOTE: This is the dev endpoint. We can't use flaskdata to provide this in Storybook because it doesn't exist in the Storybook environment.
export const SCFIND_BASE_STORYBOOK = 'https://scfind.dev.hubmapconsortium.org';

/**
 * Helper method to form URLs for SCFind API requests
 *
 * @param scFindApiUrl - The base URL for the SCFind API
 * @param endpoint - The endpoint to hit
 * @param params - The parameters to include in the URL
 */
export function createScFindKey(
  scFindApiUrl: string,
  endpoint: string,
  params: Record<string, string | undefined>,
  indexVersion?: string,
): string {
  const urlParams = new URLSearchParams();
  // Filter out undefined values from url params
  Object.entries(params)
    .filter(([, value]) => value)
    .forEach(([key, value]) => {
      urlParams.append(key, value!);
    });

  if (indexVersion) {
    urlParams.append('index_version', indexVersion);
  }
  const fullUrl = new URL(`${scFindApiUrl}/api/${endpoint}?${urlParams.toString()}`);
  return fullUrl.toString();
}

/**
 * POST-flavored scFind request key. Used as a workaround when cell type names contain
 * commas, which would otherwise be ambiguous when joined into a comma-separated GET param.
 */
export interface ScFindPostRequest {
  url: string;
  body: Record<string, unknown>;
}

export type ScFindRequest = string | ScFindPostRequest;

/**
 * Builds a POST-flavored scFind request: endpoint URL with no query params, and all
 * parameters (including index_version) in the JSON body. Undefined values are dropped.
 */
export function createScFindPostRequest(
  scFindApiUrl: string,
  endpoint: string,
  body: Record<string, unknown>,
  indexVersion?: string,
): ScFindPostRequest {
  const url = new URL(`${scFindApiUrl}/api/${endpoint}`).toString();
  const fullBody: Record<string, unknown> = {};
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) {
      fullBody[key] = value;
    }
  });
  if (indexVersion) {
    fullBody.index_version = indexVersion;
  }
  return { url, body: fullBody };
}

/**
 * Returns true if any cell type name in the input contains a comma. Comma-containing
 * names break the default GET behavior because they collide with the array separator
 * used when joining multiple cell types into a single query param.
 */
export function cellTypeNameContainsComma(value: string | string[] | undefined): boolean {
  if (!value) return false;
  if (Array.isArray(value)) return value.some((v) => v.includes(','));
  return value.includes(',');
}

function requestInitForKey(key: ScFindRequest | null): RequestInit {
  if (key === null || typeof key === 'string') return {};
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(key.body),
  };
}

/**
 * SWR fetcher that dispatches GET vs. POST based on the shape of the scFind request key.
 */
export async function scFindFetcher<T>(key: ScFindRequest): Promise<T> {
  if (typeof key === 'string') {
    return fetcher<T>({ url: key });
  }
  return fetcher<T>({ url: key.url, requestInit: requestInitForKey(key) });
}

/**
 * Multi-URL SWR fetcher for scFind. Accepts an array of GET/POST request keys (or null
 * to skip a slot) and dispatches each appropriately, preserving the matching response order.
 */
export async function scFindMultiFetcher<T>(
  keys: (ScFindRequest | null)[],
  options?: Omit<MultiFetchOptionsType, 'urls' | 'requestInits'>,
): Promise<T[]> {
  const urls = keys.map((key) => (key === null ? null : typeof key === 'string' ? key : key.url));
  const requestInits = keys.map((key) => requestInitForKey(key));
  return multiFetcher<T>({ ...options, urls, requestInits });
}

/**
 * Removes the organ prefix from a cell type name.
 * This is useful for displaying cell types without the organ context.
 * @param cellType - The cell type string, which may include an organ prefix (e.g., "organ.cellType").
 * @returns The formatted cell type name without the organ prefix (e.g., "cellType").
 */
export function formatCellTypeName(cellType: string): string {
  if (cellType.includes('.')) {
    // Remove the organ prefix from the cell type name
    return cellType.split('.')[1];
  }
  return cellType;
}

/**
 * Extracts information from a cell type string.
 * @param cellType - The cell type string (e.g., "organ.cellType:variant").
 * @returns An object containing the organ, name, and variant of the cell type.
 */
export function extractCellTypeInfo(cellType: string) {
  if (!cellType) {
    return { organ: '', name: '', variant: undefined };
  }
  if (!cellType.includes('.')) {
    // If there's no organ prefix, treat the whole string as the name
    if (cellType.includes(':')) {
      const [name, variant] = cellType.split(':');
      return { organ: '', name, variant };
    }
    return { organ: '', name: cellType, variant: undefined };
  }
  const [organ, typeWithVariant] = cellType.split('.');
  const [name, variant] = typeWithVariant.split(':');
  return { organ, name, variant };
}

/**
 * Extracts cell type information from an array of cell types.
 * This function processes a list of cell types, extracting the name, organs, and variants.
 * It assumes that the cell types are formatted as `<organ>.<cell_type>:<variant>`.
 * If the list is empty, it returns an object with empty values.
 * @param cellTypes - An array of cell type strings, each formatted as `<organ>.<cell_type>:<variant>`.
 * @returns An object containing the names, organs, and variants of the cell types.
 */
export function extractCellTypesInfo(cellTypes: string[]) {
  if (!cellTypes || cellTypes.length === 0) {
    return {
      name: '',
      organs: [],
      variants: {},
    };
  }
  const cellTypeName = cellTypes[0].split(':')[0].split('.')[1];
  const organs = cellTypes.map((cellType) => cellType.split('.')[0]);
  const variants: Record<string, string[]> = {};
  // ensure that each organ has an entry in the variants object
  // and collect unique variants for each organ
  cellTypes.forEach((cellType) => {
    const [organ, typeWithVariant] = cellType.split('.');
    const [, variant] = typeWithVariant.split(':');
    if (!variants[organ]) {
      variants[organ] = [];
    }
    if (variant && !variants[organ].includes(variant)) {
      variants[organ].push(variant);
    }
  });

  return {
    name: cellTypeName,
    organs: Array.from(new Set(organs)), // Ensure unique organs
    variants,
  };
}

export function stringIsCellType(cellType: string): boolean {
  // A cell type is a string that contains a dot (.) and optionally a colon (:)
  return cellType.includes('.') || cellType.includes(':');
}

/**
 * Converts a string or an array of strings to a single string.
 * @param input - The input string or array of strings.
 * @returns The resulting string.
 */
export function stringOrArrayToString(input: string | string[]): string {
  if (Array.isArray(input)) {
    return input.join(',');
  }
  return input;
}

/**
 * Convenience function for accessing SCFind API keys from context.
 * @returns An object containing the SCFind API endpoint and index version.
 */
export function useScFindKey() {
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  return { scFindEndpoint, scFindIndexVersion };
}
