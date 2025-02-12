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

export const includeDatasetsAndImageSupports: QueryDslQueryContainer = {
  bool: {
    should: [
      {
        term: { 'entity_type.keyword': 'Dataset' },
      },
      {
        bool: {
          must: [
            { term: { 'entity_type.keyword': 'Support' } },
            { terms: { 'vitessce-hints': ['pyramid', 'is_image'] } },
          ],
        },
      },
    ],
    minimum_should_match: 1,
  },
};

export const excludeComponentDatasetsClause: QueryDslQueryContainer = {
  bool: {
    must_not: {
      term: {
        is_component: true,
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

export const includeOnlyCollectionsClause: QueryDslQueryContainer = {
  bool: {
    must: {
      term: {
        'entity_type.keyword': 'Collection',
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
