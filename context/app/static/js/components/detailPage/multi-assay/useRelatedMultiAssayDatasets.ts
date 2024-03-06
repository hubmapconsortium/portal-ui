import { useSearchHits } from 'js/hooks/useSearchData';
import { produce } from 'immer';

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
    _source: ['uuid', 'hubmap_id', 'assay_display_name', 'processing', 'is_component'],
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
    _source: ['uuid', 'hubmap_id', 'assay_display_name', 'processing', 'is_component'],
  };
}

interface Hit<Doc extends Record<string, unknown>> {
  _source: Doc;
}

interface Hits<Doc extends Record<string, unknown>> {
  searchHits: Hit<Doc>[];
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type MultiAssayEntity = {
  uuid: string;
  hubmap_id: string;
  assay_display_name: string;
  is_component: boolean;
  processing: 'raw' | 'processed';
};

type MultiAssayHits = Hits<MultiAssayEntity>;

function getMultiAssayType({ processing, is_component }: Pick<MultiAssayEntity, 'processing' | 'is_component'>) {
  if (is_component) {
    return 'component';
  }

  return processing;
}

function buildRelatedDatasets({ uuid, entities }: { uuid: string; entities: MultiAssayEntity[] }) {
  return entities.reduce<Record<string, MultiAssayEntity[]>>((acc, curr) => {
    return produce(acc, (draft) => {
      if (curr.uuid !== uuid) {
        const multiAssayType = getMultiAssayType({ processing: curr.processing, is_component: curr.is_component });
        if (!draft[multiAssayType]) {
          draft[multiAssayType] = [];
        }
        draft[multiAssayType].push(curr);
      }
    });
  }, {});
}

function useRelatedMultiAssayDatasets(uuid: string, primaryEntity?: MultiAssayEntity) {
  const { searchHits: primaryHits } = useSearchHits(getPrimaryMultiAssay(uuid)) as MultiAssayHits;

  const primary = primaryHits[0]?._source ?? primaryEntity;

  const { searchHits: primaryDescendantHits } = useSearchHits(getPrimaryDescendants(primary ? primary.uuid : ''), {
    shouldFetch: Boolean(primary),
  }) as MultiAssayHits;

  return buildRelatedDatasets({
    uuid,
    entities: [primary, ...primaryDescendantHits.map((hit) => hit?._source)].filter((e) => e !== undefined),
  });
}

export default useRelatedMultiAssayDatasets;
