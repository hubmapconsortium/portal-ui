import React, { Suspense, useMemo } from 'react';

import VisualizationErrorBoundary from './VisualizationError';
import { VizContainerStyleContext } from './ContainerStylingContext';
import { VisualizationSuspenseFallback } from './VisualizationSuspenseFallback';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const Visualization = React.lazy(() => import('../Visualization'));

interface VisualizationWrapperProps {
  vitData: object | object[];
  uuid?: string;
  hubmap_id?: string;
  mapped_data_access_level?: string;
  hasNotebook?: boolean;
  shouldDisplayHeader?: boolean;
  hasBeenMounted?: boolean;
  isPublicationPage?: boolean;
  markerGene?: string;
}

function VisualizationWrapper({
  vitData,
  uuid,
  hubmap_id,
  mapped_data_access_level,
  hasNotebook = false,
  shouldDisplayHeader = true,
  hasBeenMounted,
  isPublicationPage = false,
  markerGene,
}: VisualizationWrapperProps) {
  const containerStyles = useMemo(
    () => ({
      shouldDisplayHeader,
      isPublicationPage,
      uuid,
    }),
    [isPublicationPage, shouldDisplayHeader, uuid],
  );
  // Find parent UUID for the visualization if present
  const parentUuid: string | undefined = useMemo(() => {
    if (Array.isArray(vitData)) {
      const vitDataArray = vitData as object[];
      const found = vitDataArray.find((data) => 'parentUuid' in data) as { parentUuid: string } | undefined;
      return found?.parentUuid;
    }
    if ('parentUuid' in vitData) {
      return (vitData as { parentUuid: string }).parentUuid;
    }
    return undefined;
  }, [vitData]);

  return (
    <VizContainerStyleContext.Provider value={containerStyles}>
      <VisualizationErrorBoundary>
        <Suspense fallback={<VisualizationSuspenseFallback />}>
          <Visualization
            vitData={vitData}
            uuid={uuid}
            hubmap_id={hubmap_id}
            mapped_data_access_level={mapped_data_access_level}
            hasNotebook={hasNotebook}
            shouldDisplayHeader={shouldDisplayHeader}
            shouldMountVitessce={hasBeenMounted}
            markerGene={markerGene}
            parentUuid={parentUuid}
          />
        </Suspense>
      </VisualizationErrorBoundary>
    </VizContainerStyleContext.Provider>
  );
}

export default VisualizationWrapper;
