import useSWR from 'swr';

import { useAuthHeader } from 'js/hooks/useSearchData';
import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import { get } from 'js/helpers/nodash';
import { useAppContext } from '../Contexts';

interface FieldType {
  type?: string;
}

type AdditionalFields = Record<string, FieldType>;

interface FieldMapping extends FieldType {
  fields?: AdditionalFields;
  copy_to?: string[];
  properties?: Record<string, FieldMapping>;
  [k: string]: unknown;
}

export interface Mappings {
  mappings: {
    properties: Record<string, FieldMapping>;
    [k: string]: unknown;
  };
}

export function getESField({ mappings, field }: { mappings: Mappings; field: string }) {
  const fieldPaths = field.split('.');
  const mappingsPath = ['mappings', ...fieldPaths].join('.properties.');

  const fieldMapping: FieldMapping = get(mappings, mappingsPath);

  if (!fieldMapping) {
    return field;
  }

  const { fields } = fieldMapping;

  if (fields?.keyword && fields?.keyword?.type === 'keyword') {
    return `${field}.keyword`;
  }

  return field;
}

export type UseESMappingType = Mappings | Record<string, never>;

export function isESMapping(mappings: UseESMappingType): mappings is Mappings {
  return mappings && Object.keys(mappings).length > 0;
}

export const DEFAULT_MAPPING_INDEX = 'portal';

/**
 * Fetches an index's field mapping, used to resolve `.keyword` subfields, along with the request's
 * error so callers can tell a failed request from one that is still loading.
 *
 * @param index Index to read the mapping of. Defaults to `portal`; the files search passes
 *   `files`, whose fields are absent from the portal mapping.
 */
export function useESmappingRequest(index: string = DEFAULT_MAPPING_INDEX): {
  mappings: Mappings | Record<string, never>;
  error: SWRError | undefined;
} {
  const { baseElasticsearchEndpoint } = useAppContext();
  const authHeader = useAuthHeader();

  const { data, error } = useSWR<Record<string, Mappings>, SWRError>(
    { requestInit: { headers: authHeader }, url: `${baseElasticsearchEndpoint}/${index}/mapping` },
    fetcher,
    {
      fallbackData: {},
    },
  );

  const mapping = data?.[Object.keys(data)?.[0]];

  return { mappings: mapping ?? {}, error };
}

/** Fetches an index's field mapping; see `useESmappingRequest`. */
export default function useESmapping(index: string = DEFAULT_MAPPING_INDEX): Mappings | Record<string, never> {
  return useESmappingRequest(index).mappings;
}
