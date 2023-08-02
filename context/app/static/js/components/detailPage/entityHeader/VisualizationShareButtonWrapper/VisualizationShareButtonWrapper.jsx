import React, { Suspense, lazy } from 'react';
import ShareIcon from '@mui/icons-material/Share';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const VisualizationShareButton = lazy(() => import('js/components/detailPage/visualization/VisualizationShareButton'));

function ShareButtonFallback() {
  return (
    <SecondaryBackgroundTooltip title="Share Visualization">
      <WhiteBackgroundIconButton disabled>
        <ShareIcon color="disabled" />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
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
