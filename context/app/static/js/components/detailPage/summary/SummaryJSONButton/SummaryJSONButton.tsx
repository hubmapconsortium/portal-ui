import React from 'react';

import { WhiteRectangularTooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { FileIcon } from 'js/shared-styles/icons';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

interface Props {
  entity_type: string;
  uuid: string;
}

function SummaryJSONButton({ entity_type, uuid }: Props) {
  const trackEntityPageEvent = useTrackEntityPageEvent();

  return (
    <WhiteRectangularTooltipIconButton
      tooltip="View JSON"
      sx={{ height: '36px', display: 'flex' }}
      href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`}
      target="_blank"
      onClick={() => trackEntityPageEvent({ action: 'View JSON' })}
    >
      <FileIcon color="primary" />
    </WhiteRectangularTooltipIconButton>
  );
}

export default SummaryJSONButton;
