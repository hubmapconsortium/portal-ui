import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import useSWR, { useSWRConfig } from 'swr';

import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import { useSearchHits } from 'js/hooks/useSearchData';
import { excludeComponentDatasetsClause, includeDatasetsAndImageSupports, getIDsQuery } from 'js/helpers/queries';
import { Dataset, isDataset } from 'js/components/types';
import { getSectionFromString } from 'js/shared-styles/sections/TableOfContents/utils';
import { fetcher } from 'js/helpers/swr';
import { TableOfContentsItem } from 'js/shared-styles/sections/TableOfContents/types';

import { getAuthHeader } from 'js/helpers/functions';
import { useEffect } from 'react';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { processDatasetLabel } from 'js/components/detailPage/ProcessedData/ProcessedDataset/hooks';
import { datasetSectionId } from './utils';

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
  | 'dbgap_study_url'
  | 'dbgap_sra_experiment_url'
  | 'is_component'
  | 'visualization'
  | 'contributors'
  | 'contacts'
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
  const swr = useSWR<VitessceConf>(getVitessceConfKey(uuid, groupsToken), (_key: unknown) =>
    fetcher({ url: `${base}?${urlParams.toString()}`, requestInit: { headers: getAuthHeader(groupsToken) } }),
  );
  if (parentUuid) {
    return { ...swr, data: { ...swr.data, parentUuid } };
  }
  return swr;
}

function useProcessedDatasets(includeComponents?: boolean) {
  const { entity } = useFlaskDataContext();
  const entityIsDataset = isDataset(entity);

  const { processing, descendant_ids } = entity;

  const query = {
    query: {
      bool: {
        // TODO: Futher narrow once we understand EPICs.
        must: includeComponents
          ? [getIDsQuery(descendant_ids), includeDatasetsAndImageSupports]
          : [getIDsQuery(descendant_ids), includeDatasetsAndImageSupports, excludeComponentDatasetsClause],
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
      'dbgap_study_url',
      'dbgap_sra_experiment_url',
      'is_component',
      'visualization',
      'contributors',
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
  searchHits,
  conf,
}: {
  hit: Required<SearchHit<ProcessedDatasetInfo>>;
  searchHits: Required<SearchHit<ProcessedDatasetInfo>>[];
  conf?: VitessceConf;
}) {
  const { files, metadata, visualization, creation_action, contributors } = hit._source;

  const shouldDisplaySection = {
    summary: true,
    visualization: visualization || Boolean(conf && 'data' in conf && conf?.data),
    files: Boolean(files?.length),
    analysis: Boolean(metadata?.dag_provenance_list),
    attribution: creation_action !== 'Central Process' && Boolean(contributors?.length),
  };

  const sectionsToDisplay = Object.entries(shouldDisplaySection).filter(([_k, v]) => v === true);
  const sectionTitle = processDatasetLabel(hit._source, searchHits);

  return {
    // TODO: Improve the lookup for descendants to exclude anything with a missing pipeline name
    ...getSectionFromString(sectionTitle, datasetSectionId(hit._source, 'section')),
    items: sectionsToDisplay.map(([s]) => ({
      ...getSectionFromString(s, datasetSectionId(hit._source, s)),
      hash: datasetSectionId(hit._source, s),
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
            getProcessedDatasetSection({ hit, searchHits, conf: cache.get(getVitessceConfKey(hit._id, groupsToken)) }),
          ),
        }
      : false;

  return {
    sections,
    isLoading,
  };
}

export function useRedirectAlert() {
  const { redirected, redirectedFromId, redirectedFromPipeline } = useFlaskDataContext();
  const { toastInfo } = useSnackbarActions();

  useEffect(() => {
    if (redirected) {
      if (redirectedFromId && redirectedFromPipeline) {
        toastInfo(
          `You have been redirected to the unified view for ${redirectedFromPipeline} dataset ${redirectedFromId}.`,
        );
      } else {
        toastInfo('You have been redirected to the unified view for this dataset.');
      }
    }
  }, [redirected, toastInfo, redirectedFromId, redirectedFromPipeline]);
}

export { useProcessedDatasets, useProcessedDatasetsSections };
export default useDatasetLabel;
