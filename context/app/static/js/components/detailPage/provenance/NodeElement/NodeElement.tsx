/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';

import useProvenanceStore, { ProvenanceStore } from 'js/stores/useProvenanceStore';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { AsteriskWrapper } from './style';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';
import { ProvNode } from '../types';

const uuidSelector = (state: ProvenanceStore) => state.uuid;
const setHasRenderedSelector = (state: ProvenanceStore) => state.setHasRendered;

// Hide the HuBMAP ID from the display title for non-entity nodes returned by provenance
// e.g. "Create Dataset" instead of "Create Dataset - HBM789.1234.123"
function getDisplayTitle(node: ProvNode, title?: string) {
  if (title) {
    return title;
  }
  if (node.nodeType === 'step') {
    return (node.title ?? node.name).split(' - ')[0];
  }
  return node.title ?? node.name;
}

interface NodeElementProps {
  node: ProvNode;
  title?: string;
  columnWidth?: number;
}

function NodeElement({ node, title, columnWidth }: NodeElementProps) {
  const style = ['input', 'output'].includes(node.nodeType) ? { width: columnWidth ?? 100 } : undefined;

  const displayTitle = getDisplayTitle(node, title);

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
