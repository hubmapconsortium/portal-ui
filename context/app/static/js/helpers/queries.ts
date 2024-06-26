import { Ids, QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

export const getAllCollectionsQuery = {
  post_filter: { term: { 'entity_type.keyword': 'Collection' } },
  size: 10000,
};

export function getIDsQuery(ids: Ids): QueryDslQueryContainer {
  return {
    ids: {
      values: ids,
    },
  };
}

export function getTermClause(term: string, value: unknown): QueryDslQueryContainer {
  return {
    term: {
      [term]: value,
    },
  };
}

export const excludeSupportEntitiesClause: QueryDslQueryContainer = {
  bool: {
    must_not: {
      term: {
        'entity_type.keyword': 'Support',
      },
    },
  },
};

export const includeOnlyDatasetsClause: QueryDslQueryContainer = {
  bool: {
    must: {
      term: {
        'entity_type.keyword': 'Dataset',
      },
    },
  },
};

export function getAncestorsQuery(descendantUUID: string): QueryDslQueryContainer {
  return {
    bool: {
      filter: [
        {
          term: {
            descendant_ids: descendantUUID,
          },
        },
      ],
    },
  };
}
