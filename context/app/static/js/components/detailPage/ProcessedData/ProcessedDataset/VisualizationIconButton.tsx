import React, { useCallback } from 'react';

import { WhiteRectangularTooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

interface Props {
  href: string;
}

function VisualizationIconButton({ href }: Props) {
  const trackEntityPageEvent = useTrackEntityPageEvent();

  const trackViewVitessceConf = useCallback(() => {
    trackEntityPageEvent({ action: 'View Vitessce Conf' });
  }, [trackEntityPageEvent]);

  return (
    <WhiteRectangularTooltipIconButton
      tooltip="View Vitessce Configuration"
      href={href}
      target="_blank"
      onClick={trackViewVitessceConf}
    >
      <VisualizationIcon color="primary" />
    </WhiteRectangularTooltipIconButton>
  );
}

export default VisualizationIconButton;
