import React, { PropsWithChildren } from 'react';
import { FaroErrorBoundary } from '@grafana/faro-react';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import { createContext, useContext } from 'js/helpers/context';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationErrorBoundaryBackground } from './style';

interface VisualizationProps {
  isPublicationPage: boolean;
  uuid: string;
  shouldDisplayHeader: boolean;
}

const FallbackContext = createContext<VisualizationProps>('VisualizationErrorBoundary');
const useFallbackContext = () => useContext(FallbackContext);

function VisualizationFallback({ message, stack }: Error) {
  const { isPublicationPage, uuid, shouldDisplayHeader } = useFallbackContext();
  return (
    <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
      <SpacedSectionButtonRow
        leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
      />
      <VisualizationErrorBoundaryBackground>
        <div>The Vitessce visualization encountered an error. Please try again or contact support.</div>
        <DetailsAccordion summary="Click to expand error details">
          {message} {stack}
        </DetailsAccordion>
      </VisualizationErrorBoundaryBackground>
    </DetailPageSection>
  );
}

function VisualizationErrorBoundary({ children, ...rest }: PropsWithChildren<VisualizationProps>) {
  return (
    <FallbackContext.Provider value={rest}>
      <FaroErrorBoundary fallback={VisualizationFallback}>{children}</FaroErrorBoundary>
    </FallbackContext.Provider>
  );
}

export default VisualizationErrorBoundary;
