import React, { Suspense, useMemo } from 'react';

import { EventWithOptionalCategory } from 'js/components/types';
import VisualizationErrorBoundary from './VisualizationError';
import { VizContainerStyleContext } from './ContainerStylingContext';
import VisualizationSkeleton from '../VitessceSkeleton/VisualizationSkeleton';

const Visualization = React.lazy(() => import('../Visualization'));

interface VisualizationWrapperProps {
  vitData: object | object[] | undefined;
  trackingInfo: EventWithOptionalCategory;
  uuid?: string;
  hasNotebook?: boolean;
  shouldDisplayHeader?: boolean;
  hasBeenMounted?: boolean;
  isPublicationPage?: boolean;
  markerGene?: string;
  hideTheme?: boolean;
  hideShare?: boolean;
  title?: React.ReactNode;
}

function VisualizationWrapper({
  vitData,
  trackingInfo,
  uuid,
  hasNotebook = false,
  shouldDisplayHeader = true,
  hasBeenMounted,
  isPublicationPage = false,
  markerGene,
  hideTheme = false,
  hideShare = false,
  title,
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
        <Suspense fallback={<VisualizationSkeleton />}>
          <Visualization
            vitData={vitData}
            uuid={uuid}
            hasNotebook={hasNotebook}
            shouldDisplayHeader={shouldDisplayHeader}
            shouldMountVitessce={hasBeenMounted}
            markerGene={markerGene}
            trackingInfo={trackingInfo}
            hideTheme={hideTheme}
            hideShare={hideShare}
            title={title}
          />
        </Suspense>
      </VisualizationErrorBoundary>
    </VizContainerStyleContext.Provider>
  );
}

export default VisualizationWrapper;
