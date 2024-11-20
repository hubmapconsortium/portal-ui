import useSWR from 'swr';

import { useAuthHeader } from 'js/hooks/useSearchData';
import { fetcher } from 'js/helpers/swr';
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

  const { fields }: FieldMapping = get(mappings, mappingsPath);

  if (fields?.keyword && fields?.keyword?.type === 'keyword') {
    return `${field}.keyword`;
  }

  return field;
}

export type UseESMappingType = Mappings | Record<string, never>;

export function isESMapping(mappings: UseESMappingType): mappings is Mappings {
  return mappings && Object.keys(mappings).length > 0;
}

export default function useESmapping(): Mappings | Record<string, never> {
  const { baseElasticsearchEndpoint } = useAppContext();
  const authHeader = useAuthHeader();

  const { data } = useSWR<Record<string, Mappings>>(
    { requestInit: { headers: authHeader }, url: `${baseElasticsearchEndpoint}/portal/mapping` },
    fetcher,
    {
      fallbackData: {},
    },
  );

  const mapping = data?.[Object.keys(data)?.[0]];

  if (mapping) {
    return mapping;
  }

  return {};
}
