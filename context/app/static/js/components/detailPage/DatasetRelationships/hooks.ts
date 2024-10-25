import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useAppContext } from 'js/components/Contexts';
import { fetchSoftAssay } from 'js/hooks/useSoftAssay';
import { NodeWithoutPosition } from './types';
import useProvData from '../provenance/hooks';
import { convertProvDataToNodesAndEdges } from './utils';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';

export function useDatasetStatuses(datasets: { status?: string }[]) {
  const statuses = useMemo(() => {
    const statusSet = new Set(datasets.map(({ status }) => status).filter(Boolean));
    return Array.from(statusSet);
  }, [datasets]) as string[];
  return statuses;
}

export function useDatasetTypes(nodes: NodeWithoutPosition[]) {
  const types = useMemo(() => {
    const typeSet = new Set(nodes.map(({ type }) => type));
    return Array.from(typeSet);
  }, [nodes]) as string[];
  return types;
}

export function useDatasetRelationships(uuid: string, processing = 'raw') {
  const shouldFetch = processing === 'raw';
  const { provData, isLoading } = useProvData(uuid, true, shouldFetch);
  const { nodes, edges } = useMemo(() => convertProvDataToNodesAndEdges(uuid, provData), [uuid, provData]);
  const shouldDisplay = nodes.length > 1 && shouldFetch;
  return { isLoading, nodes, edges, shouldDisplay };
}

interface PipelineInfoRequest {
  url: string;
  datasets: string[];
  groupsToken: string;
}

async function fetchPipelineInfo({ url, datasets, groupsToken }: PipelineInfoRequest) {
  // Only fetch pipeline info if there is one dataset descendant
  if (datasets.length !== 1) {
    return Promise.resolve('');
  }
  const result = await fetchSoftAssay({ url, dataset: datasets[0], groupsToken });

  // Handle epics separately since their pipeline-shorthand is blank
  if (result.process_state === 'epic') {
    return result['dataset-type'];
  }

  // Also handle image pyramids separately since their pipeline-shorthand is blank
  if (result['vitessce-hints'].includes('pyramid') && result['vitessce-hints'].includes('is_image')) {
    return 'Image Pyramid Generation';
  }

  return result['pipeline-shorthand'];
}

export function usePipelineInfo(datasets: string[]) {
  const { groupsToken, softAssayEndpoint } = useAppContext();
  const url = `${softAssayEndpoint}/assaytype`;
  const { data: pipelineInfo, ...rest } = useSWR<string>({ url, datasets, groupsToken }, () =>
    fetchPipelineInfo({ url, datasets, groupsToken }),
  );
  return { pipelineInfo, ...rest };
}

export function useDatasetRelationshipsTracking() {
  const trackEvent = useTrackEntityPageEvent();
  const trackFitView = useCallback(() => {
    trackEvent({
      action: 'Dataset Relationships Fit View',
    });
  }, [trackEvent]);
  const trackZoomIn = useCallback(() => {
    trackEvent({
      action: 'Dataset Relationships Zoom In',
    });
  }, [trackEvent]);
  const trackZoomOut = useCallback(() => {
    trackEvent({
      action: 'Dataset Relationships Zoom Out',
    });
  }, [trackEvent]);
  return { trackFitView, trackZoomIn, trackZoomOut };
}
