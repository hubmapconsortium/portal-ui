import CircularProgress from '@mui/material/CircularProgress';
import React, { Suspense } from 'react';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationBackground } from './style';

const Visualization = React.lazy(() => import('../Visualization'));

function VisualizationWrapper({ vitData, uuid, hasNotebook, shouldDisplayHeader, hasBeenMounted, isPublicationPage }) {
  return (
    <Suspense
      fallback={
        <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
          <SpacedSectionButtonRow
            leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
          />
          <VisualizationBackground>
            <CircularProgress />
          </VisualizationBackground>
        </DetailPageSection>
      }
    >
      <Visualization
        vitData={vitData}
        uuid={uuid}
        hasNotebook={hasNotebook}
        shouldDisplayHeader={shouldDisplayHeader}
        shouldMountVitessce={hasBeenMounted}
      />
    </Suspense>
  );
}

VisualizationWrapper.defaultProps = {
  shouldDisplayHeader: true,
};

export default VisualizationWrapper;
