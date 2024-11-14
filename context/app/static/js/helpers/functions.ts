import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { format } from 'date-fns/format';
import { nodeIcons } from 'js/components/detailPage/DatasetRelationships/nodeTypes';
import { Dataset, ESEntityType, Entity, isDataset } from 'js/components/types';
import { MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';
import { MergedWorkspace } from 'js/components/workspaces/types';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';

export function isEmptyArrayOrObject(val: object | unknown[]) {
  if (val.constructor.name === 'Object') {
    return Object.keys(val).length === 0;
  }
  if (val.constructor.name === 'Array' && Array.isArray(val)) {
    return val.length === 0;
  }
  return false;
}

export function capitalizeString(s?: string) {
  if (!s) {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const NOT_CAPITALIZED_WORDS = ['of', 'to', 'and', 'the', 'a'];

export function shouldCapitalizeString(s: string, idx = 1) {
  const lowerCase = s.toLowerCase();
  if (idx === 0) {
    return true;
  }
  return NOT_CAPITALIZED_WORDS.indexOf(lowerCase) === -1;
}

export function capitalizeAndReplaceDashes(s: string) {
  return s
    .split('-')
    .map((word, idx) => (shouldCapitalizeString(word, idx) ? capitalizeString(word) : word))
    .join(' ');
}

export function replaceUnderscore(s: string) {
  return s.replace(/_/g, ' ');
}

export function readCookie(name: string) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i !== ca.length; i++) {
    let c = ca[i];
    while (c.startsWith(' ')) c = c.substring(1, c.length);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function getTokenParam(groupsToken: string) {
  return groupsToken ? `?token=${groupsToken}` : '';
}

export function getAuthHeader(groupsToken: string): HeadersInit {
  return groupsToken
    ? {
        Authorization: `Bearer ${groupsToken}`,
      }
    : {};
}

export function throttle<FNArgs extends FunctionConstructor['arguments'], FNReturn>(
  fn: (args: FNArgs) => FNReturn,
  wait: number,
) {
  let previouslyRun: number;
  let queuedToRun: ReturnType<typeof setTimeout> | ReturnType<typeof clearTimeout>;

  return function invokeFn(args: FNArgs) {
    const now = Date.now();

    queuedToRun = queuedToRun ? clearTimeout(queuedToRun) : undefined;

    if (!previouslyRun || now - previouslyRun >= wait) {
      fn(args);
      previouslyRun = now;
    } else {
      const argsToPass = Array.isArray(args) ? args : [args];
      queuedToRun = setTimeout(
        invokeFn.bind(null as ThisParameterType<null>, ...(argsToPass as never[])),
        wait - (now - previouslyRun),
      );
    }
  };
}

export function tableToDelimitedString(rows: object[], colNames: string[], d: string): string {
  const str = rows.reduce((acc, row) => {
    const rowStr = Object.values(row).join(d);
    return acc.concat('\n', rowStr);
  }, colNames.join(d));
  return str;
}

export function createDownloadUrl(fileStr: string | Blob, fileType: string) {
  return window.URL.createObjectURL(new Blob([fileStr], { type: fileType }));
}

export function getDefaultQuery() {
  return {
    bool: {
      must_not: ['next_revision_uuid', 'sub_status'].map((field) => ({
        exists: {
          field,
        },
      })),
    },
  };
}

export function combineQueryClauses(queries: object | object[]) {
  return {
    bool: {
      must: queries,
    },
  };
}

export function addRestrictionsToQuery({ query, ...rest }: SearchRequest): SearchRequest {
  const defaultQuery = getDefaultQuery();
  const queries = query ? [query, defaultQuery] : [defaultQuery];

  return {
    query: { ...combineQueryClauses(queries) },
    ...rest,
  };
}

interface SearchHit {
  _source: {
    entity_type: string;
  };
}

export function getSearchHitsEntityCounts(searchHits: SearchHit[]) {
  const counts = searchHits.reduce(
    (acc, { _source: { entity_type } }) => {
      if (!(entity_type in acc)) {
        // Support entities may be in the user's list.
        acc[entity_type] = 0;
      }
      const incrementedCount = acc[entity_type] + 1;
      return { ...acc, [entity_type]: incrementedCount };
    },
    { Donor: 0, Sample: 0, Dataset: 0 } as Record<string, number>,
  );

  return counts;
}

export function getArrayRange(n: number): number[] {
  return [...Array(n).keys()];
}

export function getDonorAgeString({ age_value, age_unit }: { age_value: number; age_unit: string }) {
  if (!(age_value && age_unit)) {
    return '';
  }
  return [age_value, age_unit].join(' ');
}

export function filterObjectByKeys<O extends object, K extends keyof O>(obj: O, keys: K[]) {
  const allKeys = Object.keys(obj) as K[];
  const validKeys = keys.filter((k) => allKeys.includes(k));
  return validKeys.reduce((acc, k: K) => {
    return {
      ...acc,
      [k]: obj[k],
    };
  }, {} as Partial<O>);
}

export function getOriginSamplesOrgan(entity: { origin_samples_unique_mapped_organs: string[] }) {
  return entity.origin_samples_unique_mapped_organs.join(', ');
}

/**
 * Given an array of strings, create a single comma-separated string that includes
 * 'and' as well as an oxford comma.
 *   Ex: ['apples'] => 'apples'
 *   Ex: ['apples', 'bananas'] => 'apples and bananas'
 *   Ex: ['apples', 'bananas', 'grapes'] => 'apples, bananas, and grapes'
 * @author Austen Money
 * @param list an array of elements to be made into a single comma-separated string.
 * @returns a comma-separated string.
 */
export function generateCommaList(list: string[]): string {
  const { length } = list;

  return length < 2
    ? list.join('')
    : `${list.slice(0, length - 1).join(', ')}${length < 3 ? ' and ' : ', and '}${list[length - 1]}`;
}

/**
 * Check if a given workspace has reached the maximum number of datasets allowed.
 * @author Austen Money
 * @param workspace the workspace to check.
 * @returns true if the workspace has reached the maximum number of datasets allowed, false otherwise.
 */
export function isWorkspaceAtDatasetLimit(workspace: MergedWorkspace) {
  return workspace.workspace_details.current_workspace_details.symlinks.length >= MAX_NUMBER_OF_WORKSPACE_DATASETS;
}

/**
 * Check if a given email address is valid.
 * @author Austen Money
 * @param email the email address to check.
 * @returns true if the address is valid, false otherwise.
 */
export function isValidEmail(email: string) {
  // validation regex, sourced from HTML living standard: http://www.whatwg.org/specs/web-apps/current-work/multipage/forms.html#e-mail-state-(type=email)
  const emailRegex =
    // eslint-disable-next-line
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const cleanedValue: string = email?.replace(/^\s+|\s+$/g, '');
  return emailRegex.test(cleanedValue);
}

export function getEntityIcon(entity: { entity_type: ESEntityType; is_component?: boolean; processing?: string }) {
  if (isDataset(entity)) {
    if (entity.is_component) {
      return nodeIcons.componentDataset;
    }
    if (entity.processing === 'processed') {
      return nodeIcons.processedDataset;
    }
    return nodeIcons.primaryDataset;
  }
  return entityIconMap[entity.entity_type];
}

/**
 * Find the creation information for a given entity. Datasets use the published date if available,
 * otherwise the last modified date. Other entities use the creation date.
 * @author Austen Money
 */
export function getEntityCreationInfo({
  entity_type,
  published_timestamp,
  created_timestamp,
  last_modified_timestamp,
}: Pick<Entity, 'entity_type'> &
  Partial<Pick<Dataset, 'published_timestamp' | 'last_modified_timestamp' | 'created_timestamp'>>) {
  let creationLabel;
  let creationVerb;
  let creationTimestamp;

  if (entity_type === 'Dataset') {
    if (published_timestamp) {
      creationLabel = 'Publication Date';
      creationVerb = 'Published';
      creationTimestamp = published_timestamp;
    } else {
      creationLabel = 'Last Modified Date';
      creationVerb = 'Modified';
      creationTimestamp = last_modified_timestamp;
    }
  } else {
    creationLabel = 'Creation Date';
    creationVerb = 'Created';
    creationTimestamp = created_timestamp;
  }

  return {
    creationLabel,
    creationVerb,
    creationDate: creationTimestamp ? format(creationTimestamp, 'yyyy-MM-dd') : 'N/A',
  };
}
