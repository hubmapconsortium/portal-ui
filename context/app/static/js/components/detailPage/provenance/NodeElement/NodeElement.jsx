/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';

import useProvenanceStore from 'js/stores/useProvenanceStore';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { AsteriskWrapper } from './style';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';

const uuidSelector = (state) => state.uuid;
const setHasRenderedSelector = (state) => state.setHasRendered;

function NodeElement({ node, title, columnWidth }) {
  const style = node.nodeType === 'input' || node.nodeType === 'output' ? { width: columnWidth || 100 } : null;

  const displayTitle = title || node.title || node.name;

  const uuid = useProvenanceStore(uuidSelector);
  const setHasRendered = useProvenanceStore(setHasRenderedSelector);

  const trackEntityPageEvent = useTrackEntityPageEvent();

  useEffect(() => {
    setHasRendered();
  }, [setHasRendered]);

  return (
    <SecondaryBackgroundTooltip title={displayTitle}>
      <div
        data-testid={displayTitle}
        className="node-visible-element"
        style={style}
        onClick={() => trackEntityPageEvent({ action: 'Provenance / Graph / Select Node', label: displayTitle })}
      >
        <Typography className="node-name">{displayTitle}</Typography>
        {uuid === node.meta.prov['hubmap:uuid'] && <AsteriskWrapper aria-label="">*</AsteriskWrapper>}
      </div>
    </SecondaryBackgroundTooltip>
  );
}

export default NodeElement;
