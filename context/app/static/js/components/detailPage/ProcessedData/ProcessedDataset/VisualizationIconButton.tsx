import React from 'react';

import { WhiteRectangularTooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

interface Props {
  href: string;
}

function VisualizationIconButton({ href }: Props) {
  const trackEntityPageEvent = useTrackEntityPageEvent();

  return (
    <WhiteRectangularTooltipIconButton
      tooltip="View Vitessce Configuration"
      href={href}
      target="_blank"
      onClick={() => trackEntityPageEvent({ action: 'View Vitessce Conf' })}
    >
      <VisualizationIcon color="primary" />
    </WhiteRectangularTooltipIconButton>
  );
}

export default VisualizationIconButton;
