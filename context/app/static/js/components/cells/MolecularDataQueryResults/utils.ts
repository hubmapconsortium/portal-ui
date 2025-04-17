import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

type CellsResults = { uuid?: string } | { hubmap_id?: string };

export function getSearchQuery(cellsResults?: CellsResults[]): SearchRequest {
  if (cellsResults === undefined) {
    return {};
  }
  const uuid = cellsResults.map((result) => ('uuid' in result ? result.uuid : undefined)).filter(Boolean) as string[];
  const hubmap_id = cellsResults
    .map((result) => ('hubmap_id' in result ? result.hubmap_id : undefined))
    .filter(Boolean) as string[];

  const terms: Record<string, string[]> = {
    uuid,
    'hubmap_id.keyword': hubmap_id,
  };

  if (terms?.uuid?.length === 0) {
    delete terms.uuid;
  }

  if (terms?.['hubmap_id.keyword']?.length === 0) {
    delete terms['hubmap_id.keyword'];
  }

  return {
    size: 10000,
    post_filter: {
      bool: {
        must: [
          {
            term: {
              'entity_type.keyword': 'Dataset',
            },
          },
          {
            terms,
          },
        ],
      },
    },
    _source: [
      'uuid',
      'hubmap_id',
      'dataset_type',
      'origin_samples_unique_mapped_organs',
      'donor',
      'last_modified_timestamp',
    ],
  };
}
