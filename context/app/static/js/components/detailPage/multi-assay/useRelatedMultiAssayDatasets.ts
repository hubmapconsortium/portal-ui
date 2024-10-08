import { produce } from 'immer';

import { useSearchHits } from 'js/hooks/useSearchData';
import { useFlaskDataContext } from 'js/components/Contexts';
import { Dataset, isDataset } from 'js/components/types';

const source = [
  'uuid',
  'status',
  'mapped_status',
  'hubmap_id',
  'entity_type',
  'assay_display_name',
  'processing',
  'is_component',
  'metadata',
  'descendant_counts',
  'last_modified_timestamp',
];

function getPrimaryMultiAssay(uuid: string) {
  return {
    size: 1,
    query: {
      bool: {
        must: [
          {
            term: {
              'descendant_ids.keyword': uuid,
            },
          },
          {
            term: {
              'entity_type.keyword': 'Dataset',
            },
          },
          {
            term: {
              'assay_modality.keyword': 'multiple',
            },
          },
          {
            term: {
              'processing.keyword': 'raw',
            },
          },
          {
            term: {
              is_component: false,
            },
          },
        ],
      },
    },
    _source: source,
  };
}

function getPrimaryDescendants(uuid: string) {
  return {
    size: 10000,
    query: {
      bool: {
        must: [
          {
            term: {
              'entity_type.keyword': 'Dataset',
            },
          },
          {
            term: {
              'ancestor_ids.keyword': uuid,
            },
          },
        ],
      },
    },
    _source: source,
  };
}

export type MultiAssayEntity = Pick<
  Dataset,
  | 'uuid'
  | 'status'
  | 'mapped_status'
  | 'hubmap_id'
  | 'entity_type'
  | 'assay_display_name'
  | 'processing'
  | 'is_component'
  | 'metadata'
  | 'descendant_counts'
  | 'last_modified_timestamp'
>;

function getMultiAssayType({ processing, is_component }: Pick<MultiAssayEntity, 'processing' | 'is_component'>) {
  if (is_component) {
    return 'component';
  }

  return processing;
}

export type RelatedMultiAssayDatasets = Record<'component' | 'raw' | 'processed', MultiAssayEntity[]>;

function buildRelatedDatasets({ entities }: { entities: MultiAssayEntity[] }) {
  return entities.reduce<RelatedMultiAssayDatasets>(
    (acc, curr) => {
      return produce(acc, (draft) => {
        const multiAssayType = getMultiAssayType({ processing: curr.processing, is_component: curr.is_component });
        if (draft[multiAssayType]) {
          draft[multiAssayType].push(curr);
          // Sort by if pushlished, and then by last_modified_timestamp
          draft[multiAssayType].sort((a, b) => {
            if (a.mapped_status === 'published' && b.mapped_status !== 'published') return -1;
            if (a.mapped_status !== 'published' && b.mapped_status === 'published') return 1;
            return b.last_modified_timestamp - a.last_modified_timestamp;
          });
        }
      });
    },
    { component: [], raw: [], processed: [] },
  );
}

function useRelatedMultiAssayDatasets() {
  const { entity } = useFlaskDataContext();

  const { uuid } = entity;

  const entityIsDataset = isDataset(entity);
  if (!entityIsDataset) {
    console.error(`Expected entity to be a dataset, but it was a ${entity.entity_type}`);
  }
  const isPrimary = entityIsDataset ? getMultiAssayType(entity) === 'raw' : false;

  const { searchHits: primaryHits, isLoading: isLoadingPrimary } = useSearchHits<MultiAssayEntity>(
    getPrimaryMultiAssay(uuid),
    {
      shouldFetch: !isPrimary && entityIsDataset,
    },
  );

  const primary = primaryHits?.[0]?._source ?? entity;

  const { searchHits: primaryDescendantHits, isLoading: isLoadingDescendants } = useSearchHits<MultiAssayEntity>(
    getPrimaryDescendants(primary ? primary.uuid : ''),
    {
      shouldFetch: Boolean(primary) && entityIsDataset,
    },
  );

  const entities = [primary, ...(primaryDescendantHits ?? []).map((hit) => hit?._source)].filter(Boolean);

  if (!entityIsDataset) {
    return {
      datasets: {} as RelatedMultiAssayDatasets,
      isLoading: false,
    };
  }

  return {
    datasets: buildRelatedDatasets({
      entities,
    }),
    isLoading: isLoadingPrimary || isLoadingDescendants,
  };
}

function useRelatedMultiAssayMetadata() {
  const { datasets } = useRelatedMultiAssayDatasets();

  return Object.values(datasets)
    .flat()
    .filter((d) => d?.metadata?.metadata);
}

export { useRelatedMultiAssayMetadata };
export default useRelatedMultiAssayDatasets;
