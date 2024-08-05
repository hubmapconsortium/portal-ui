import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import useSWR from 'swr';

import { useFlaskDataContext } from 'js/components/Contexts';
import { useSearchHits } from 'js/hooks/useSearchData';
import { excludeComponentDatasetsClause, getIDsQuery } from 'js/helpers/queries';
import { Dataset, isDataset } from 'js/components/types';
import { formatSectionHash, getSectionFromString } from 'js/shared-styles/sections/TableOfContents/utils';
import { partialMultiFetcher } from 'js/helpers/swr';
import { TableOfContentsItem } from 'js/shared-styles/sections/TableOfContents/types';
import { useLayoutEffect } from 'react';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

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
  | 'creation_action'
>;

type VitessceConf = object | null;

async function fetchVitessceConfMap(urls: string[], uuids: string[]) {
  const confs = await partialMultiFetcher<VitessceConf>({ urls });

  const confPairs = confs.map((conf, i) => [uuids[i], conf.status === 'fulfilled' ? conf.value : null]);
  const filteredConfs = confPairs.filter(([_id, conf]) => Boolean(conf)) as [string, VitessceConf][];

  return new Map<string, VitessceConf>(filteredConfs);
}

function useVitessceConfs({
  uuids,
  shouldFetch = true,
  parentSettings = {},
}: {
  uuids: string[];
  shouldFetch?: boolean;
  parentSettings: Record<string, string>;
}) {
  const urls = uuids.map((id) => {
    const base = `/browse/dataset/${id}.vitessce.json`;
    // Use current URL params to pass marker gene to the Vitessce config.
    const urlParams = new URLSearchParams(window.location.search);
    // If one of the descendants is an image pyramid, pass the parent UUID to the Vitessce config.
    if (parentSettings[id]) {
      urlParams.set('parent', parentSettings[id]);
    }
    return `${base}?${urlParams.toString()}`;
  });
  return useSWR(shouldFetch ? [urls, uuids] : null, ([links, ids]) => fetchVitessceConfMap(links, ids), {
    fallbackData: new Map(),
  });
}

function useProcessedDatasets() {
  const { entity } = useFlaskDataContext();
  const entityIsDataset = isDataset(entity);

  const { processing, descendant_ids } = entity;

  const query = {
    query: {
      bool: {
        // TODO: Futher narrow once we understand EPICs.
        must: [getIDsQuery(descendant_ids), excludeComponentDatasetsClause],
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
      'creation_action',
    ],
    size: 10000,
  };

  const isPrimary = processing === 'raw';

  const shouldFetch = isPrimary && entityIsDataset;

  const { searchHits, isLoading } = useSearchHits<ProcessedDatasetTypes>(query, {
    shouldFetch,
  });

  const parentSettings: Record<string, string> = searchHits.reduce(
    (acc, hit) => {
      // @ts-expect-error TODO: Fix this, temporary workaround for image pyramids
      if (hit._source.entity_type === 'Support') {
        acc[hit._id] = entity.uuid;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  const { data: confs, isLoading: isLoadingConfs } = useVitessceConfs({
    uuids: descendant_ids,
    shouldFetch,
    parentSettings,
  });

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
  const { toastError } = useSnackbarActions();
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
          } else {
            // TODO: May need to be iterated on to provide a better error message.
            // Sections may be missing due to:
            // - malformed hash (incorrectly copied link, typo, etc)
            // - original link pointed to QA-only dataset and the user is not able to view it
            // - original link pointed to older version of the dataset and the user needs to select it
            toastError(
              'Could not find the section you were looking for. The dataset you wish to view may have been updated to a new version.',
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isLoading, toastError]);
}

export { useProcessedDatasets, useProcessedDatasetsSections, useLazyLoadedHashHandler };
export default useDatasetLabel;
