import React from 'react';
import Typography from '@material-ui/core/Typography';

import useProvenanceStore from 'js/stores/useProvenanceStore';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { AsteriskWrapper } from './style';

const provenanceStoreUUIDSelector = (state) => state.uuid;

function NodeElement(props) {
  const { node, title, columnWidth } = props;
  const style = node.nodeType === 'input' || node.nodeType === 'output' ? { width: columnWidth || 100 } : null;

  const displayTitle = title || node.title || node.name;

  const uuid = useProvenanceStore(provenanceStoreUUIDSelector);

  return (
    <SecondaryBackgroundTooltip title={displayTitle}>
      <div data-testid={displayTitle} className="node-visible-element" style={style}>
        <Typography className="node-name">{displayTitle}</Typography>
        {uuid === node.meta.prov['hubmap:uuid'] && <AsteriskWrapper aria-label="">*</AsteriskWrapper>}
      </div>
    </SecondaryBackgroundTooltip>
  );
}

export default NodeElement;
