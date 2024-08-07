import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import useSWR, { useSWRConfig } from 'swr';

import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import { useSearchHits } from 'js/hooks/useSearchData';
import { excludeComponentDatasetsClause, getIDsQuery } from 'js/helpers/queries';
import { Dataset, isDataset } from 'js/components/types';
import { formatSectionHash, getSectionFromString } from 'js/shared-styles/sections/TableOfContents/utils';
import { fetcher } from 'js/helpers/swr';
import { TableOfContentsItem } from 'js/shared-styles/sections/TableOfContents/types';
import { useLayoutEffect } from 'react';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { getAuthHeader } from 'js/helpers/functions';

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

export type ProcessedDatasetInfo = Pick<
  Dataset,
  | 'hubmap_id'
  | 'entity_type'
  | 'uuid'
  | 'assay_display_name'
  | 'files'
  | 'pipeline'
  | 'status'
  | 'metadata'
  | 'creation_action'
  | 'created_timestamp'
>;

type VitessceConf = object | undefined;

// Helper function to access the result in the cache.
function getVitessceConfKey(uuid: string, groupsToken: string) {
  return `vitessce-conf-${uuid}-${groupsToken}`;
}

export function useVitessceConf(uuid: string, parentUuid?: string) {
  const { groupsToken } = useAppContext();
  const base = `/browse/dataset/${uuid}.vitessce.json`;
  const urlParams = new URLSearchParams(window.location.search);
  if (parentUuid) {
    urlParams.set('parent', parentUuid);
  }
  return useSWR<VitessceConf>(getVitessceConfKey(uuid, groupsToken), (_key: unknown) =>
    fetcher({ url: `${base}${urlParams.toString()}`, requestInit: { headers: getAuthHeader(groupsToken) } }),
  );
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
      'status',
      'metadata',
      'creation_action',
      'created_timestamp',
    ],
    size: 10000,
  };

  const isPrimary = processing === 'raw';

  const shouldFetch = isPrimary && entityIsDataset;

  const { searchHits, isLoading } = useSearchHits<ProcessedDatasetInfo>(query, {
    shouldFetch,
  });

  return { searchHits, isLoading };
}

function getProcessedDatasetSection({
  hit,
  conf,
}: {
  hit: Required<SearchHit<ProcessedDatasetInfo>>;
  conf?: VitessceConf;
}) {
  const { pipeline, hubmap_id } = hit._source;

  const shouldDisplaySection = {
    summary: true,
    visualization: Boolean(conf && 'data' in conf && conf?.data),
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
  const { searchHits, isLoading } = useProcessedDatasets();

  const { cache } = useSWRConfig();

  const { groupsToken } = useAppContext();

  const sections =
    searchHits.length > 0
      ? {
          ...getSectionFromString('processed-data'),
          items: searchHits.map((hit) =>
            getProcessedDatasetSection({ hit, conf: cache.get(getVitessceConfKey(hit._id, groupsToken)) }),
          ),
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
