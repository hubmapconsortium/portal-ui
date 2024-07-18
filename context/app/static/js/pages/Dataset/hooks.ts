import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useSearchHits } from 'js/hooks/useSearchData';
import { excludeComponentDatasetsClause, excludeSupportEntitiesClause, getIDsQuery } from 'js/helpers/queries';
import { Dataset, isDataset } from 'js/components/types';
import { getSectionFromString } from 'js/shared-styles/sections/TableOfContents/utils';

function useDatasetLabelPrefix() {
  const {
    entity: { processing, is_component },
  } = useFlaskDataContext();

  if (is_component) {
    return 'Component';
  }

  switch (processing) {
    case 'processed':
      return 'Processed';
    case 'raw':
      return 'Primary';
    default:
      return '';
  }
}

function useDatasetLabel() {
  const prefix = useDatasetLabelPrefix();

  return [prefix, 'Dataset'].join(' ');
}

type ProcessedDatasetTypes = Pick<
  Dataset,
  'hubmap_id' | 'entity_type' | 'uuid' | 'assay_display_name' | 'files' | 'pipeline'
>;

function useProcessedDatasets() {
  const { entity } = useFlaskDataContext();
  const entityIsDataset = isDataset(entity);

  const { processing, descendant_ids } = entity;

  const query = {
    query: {
      bool: {
        // TODO: Futher narrow once we understand EPICs.
        must: [getIDsQuery(descendant_ids), excludeSupportEntitiesClause, excludeComponentDatasetsClause],
      },
    },
    _source: ['hubmap_id', 'entity_type', 'uuid', 'assay_display_name', 'files', 'pipeline'],
    size: 10000,
  };

  const isPrimary = entityIsDataset ? processing === 'raw' : false;

  return useSearchHits<ProcessedDatasetTypes>(query, {
    shouldFetch: isPrimary && entityIsDataset,
  });
}

const processedDatasetSections = ['summary', 'files'];

function getProcessedDatasetSection(hit: Required<SearchHit<ProcessedDatasetTypes>>) {
  const { pipeline, hubmap_id } = hit._source;

  return {
    ...getSectionFromString(pipeline),
    items: processedDatasetSections.map((s) => ({ ...getSectionFromString(s), hash: `${s}-${hubmap_id}` })),
  };
}

function useProcessedDatasetsSections() {
  const { searchHits, isLoading } = useProcessedDatasets();
  return { sections: searchHits.map((hit) => getProcessedDatasetSection(hit)), isLoading };
}

export { useProcessedDatasets, useProcessedDatasetsSections };
export default useDatasetLabel;
