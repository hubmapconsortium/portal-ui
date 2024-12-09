import { useCallback, useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
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

export function usePipelineInfo(datasetUUIDs: string[] = []) {
  const { searchHits, ...rest } = useSearchHits<{ pipeline: string }>(
    {
      query: getIDsQuery([...datasetUUIDs]),
      _source: ['pipeline'],
    },
    { shouldFetch: datasetUUIDs.length === 1 },
  );

  const pipelineInfo = searchHits?.[0]?._source?.pipeline;
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
