import React, { Suspense, lazy } from 'react';
import ShareIcon from '@mui/icons-material/Share';

import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';

const VisualizationShareButton = lazy(() => import('js/components/detailPage/visualization/VisualizationShareButton'));

function ShareButtonFallback() {
  return (
    <WhiteBackgroundIconTooltipButton tooltip="Share Visualization" disabled>
      <ShareIcon color="disabled" />
    </WhiteBackgroundIconTooltipButton>
  );
}

function VisualizationShareButtonWrapper() {
  return (
    <Suspense fallback={<ShareButtonFallback />}>
      <VisualizationShareButton />
    </Suspense>
  );
}

export default VisualizationShareButtonWrapper;
