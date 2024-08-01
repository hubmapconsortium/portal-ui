import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import useSWR from 'swr';

import { useFlaskDataContext } from 'js/components/Contexts';
import { useSearchHits } from 'js/hooks/useSearchData';
import { excludeComponentDatasetsClause, excludeSupportEntitiesClause, getIDsQuery } from 'js/helpers/queries';
import { Dataset, isDataset } from 'js/components/types';
import { formatSectionHash, getSectionFromString } from 'js/shared-styles/sections/TableOfContents/utils';
import { partialMultiFetcher } from 'js/helpers/swr';
import { TableOfContentsItem } from 'js/shared-styles/sections/TableOfContents/types';
import { useLayoutEffect } from 'react';

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

export type ProcessedDatasetTypes = Pick<
  Dataset,
  | 'hubmap_id'
  | 'entity_type'
  | 'uuid'
  | 'assay_display_name'
  | 'files'
  | 'pipeline'
  | 'description'
  | 'status'
  | 'group_name'
  | 'created_by_user_displayname'
  | 'created_by_user_email'
  | 'title'
  | 'published_timestamp'
  | 'created_timestamp'
  | 'metadata'
  | 'protocol_url' // TODO: This is present for non-dataset entities, but not for datasets.
  | 'dataset_type'
>;

type VitessceConf = object | null;

async function fetchVitessceConfMap(uuids: string[]) {
  const urls = uuids.map((id) => `/browse/dataset/${id}.vitessce.json`);
  const confs = await partialMultiFetcher<VitessceConf>({ urls });

  const confPairs = confs.map((conf, i) => [uuids[i], conf.status === 'fulfilled' ? conf.value : null]);
  const filteredConfs = confPairs.filter(([_id, conf]) => Boolean(conf)) as [string, VitessceConf][];

  return new Map<string, VitessceConf>(filteredConfs);
}

function useVitessceConfs({ uuids, shouldFetch = true }: { uuids: string[]; shouldFetch?: boolean }) {
  return useSWR(shouldFetch ? uuids : null, (u) => fetchVitessceConfMap(u), { fallbackData: new Map() });
}

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
    _source: [
      'hubmap_id',
      'entity_type',
      'uuid',
      'assay_display_name',
      'files',
      'pipeline',
      'description',
      'status',
      'group_name',
      'created_by_user_displayname',
      'created_by_user_email',
      'title',
      'published_timestamp',
      'created_timestamp',
      'metadata.dag_provenance_list',
      'metadata.metadata',
      'protocol_url',
      'dataset_type',
    ],
    size: 10000,
  };

  const isPrimary = processing === 'raw';

  const shouldFetch = isPrimary && entityIsDataset;

  const { searchHits, isLoading } = useSearchHits<ProcessedDatasetTypes>(query, {
    shouldFetch,
  });

  const { data: confs, isLoading: isLoadingConfs } = useVitessceConfs({ uuids: descendant_ids, shouldFetch });

  return { searchHits, confs, isLoading: isLoading || isLoadingConfs };
}

function getProcessedDatasetSection({
  hit,
  conf,
}: {
  hit: Required<SearchHit<ProcessedDatasetTypes>>;
  conf?: VitessceConf;
}) {
  const { pipeline, hubmap_id } = hit._source;

  const shouldDisplaySection = {
    summary: true,
    visualization: Boolean(conf),
    files: Boolean(hit?._source?.files),
    analysis: Boolean(hit?._source?.metadata?.dag_provenance_list),
  };

  const sectionsToDisplay = Object.entries(shouldDisplaySection).filter(([_k, v]) => v === true);

  return {
    // TODO: Improve the lookup for descendants to exclude anything with a missing pipeline name
    ...getSectionFromString(pipeline ?? hubmap_id, `section-${hubmap_id}`),
    items: sectionsToDisplay.map(([s]) => ({
      ...getSectionFromString(s),
      hash: formatSectionHash(`${s}-${hubmap_id}`),
    })),
  };
}

function useProcessedDatasetsSections(): { sections: TableOfContentsItem | false; isLoading: boolean } {
  const { searchHits, confs, isLoading } = useProcessedDatasets();

  const sections =
    searchHits.length > 0
      ? {
          ...getSectionFromString('processed-data'),
          items: searchHits.map((hit) => getProcessedDatasetSection({ hit, conf: confs.get(hit._id) })),
        }
      : false;

  return {
    sections,
    isLoading,
  };
}

function useLazyLoadedHashHandler() {
  const { isLoading } = useProcessedDatasets();
  useLayoutEffect(() => {
    if (!isLoading && window.location.hash) {
      const { hash } = window.location;
      const decodedHash = decodeURIComponent(hash);

      if (decodedHash) {
        // Since `document.querySelector` can fail if the hash is invalid, wrap it in a try-catch block.
        try {
          const element = document.querySelector(decodedHash);
          if (element) {
            element.scrollIntoView();
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isLoading]);
}

export { useProcessedDatasets, useProcessedDatasetsSections, useLazyLoadedHashHandler };
export default useDatasetLabel;
