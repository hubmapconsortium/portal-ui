import { get } from 'js/helpers/nodash';
import esMapping from './es-mapping.json';

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

interface Mappings {
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

export function getPortalESField(field: string) {
  return getESField({ mappings: esMapping, field });
}
