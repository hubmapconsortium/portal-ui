import React, { Suspense, useMemo } from 'react';

import VisualizationErrorBoundary from './VisualizationError';
import { VizContainerStyleContext } from './ContainerStylingContext';
import { VisualizationSuspenseFallback } from './VisualizationSuspenseFallback';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const Visualization = React.lazy(() => import('../Visualization'));

interface VisualizationWrapperProps {
  vitData: object | object[];
  uuid?: string;
  hasNotebook?: boolean;
  shouldDisplayHeader?: boolean;
  hasBeenMounted?: boolean;
  isPublicationPage?: boolean;
  markerGene?: string;
}

function VisualizationWrapper({
  vitData,
  uuid,
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

  return (
    <VizContainerStyleContext.Provider value={containerStyles}>
      <VisualizationErrorBoundary>
        <Suspense fallback={<VisualizationSuspenseFallback />}>
          <Visualization
            vitData={vitData}
            uuid={uuid}
            hasNotebook={hasNotebook}
            shouldDisplayHeader={shouldDisplayHeader}
            shouldMountVitessce={hasBeenMounted}
            markerGene={markerGene}
          />
        </Suspense>
      </VisualizationErrorBoundary>
    </VizContainerStyleContext.Provider>
  );
}

export default VisualizationWrapper;
