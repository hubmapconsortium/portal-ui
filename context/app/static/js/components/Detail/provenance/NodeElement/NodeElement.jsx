import React from 'react';

import useProvenanceStore from 'js/stores/useProvenanceStore';
import { Asterisk } from './style';

const provenanceStoreSelector = (state) => state.uuid;

function NodeElement(props) {
  const { node, title, columnWidth } = props;
  const style = node.nodeType === 'input' || node.nodeType === 'output' ? { width: columnWidth || 100 } : null;

  const uuid = useProvenanceStore(provenanceStoreSelector);

  function tooltip() {
    let output = '';

    // Node Type
    if (node.nodeType === 'step') {
      output += `<small>Step ${(node.column - 1) / 2 + 1}</small>`;
    } else {
      let { nodeType } = node;
      nodeType = nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
      output += `<small>${nodeType}</small>`;
    }

    // Title
    output += `<h5 class="text-600 tooltip-title">${node.title || node.name}</h5>`;

    // Description
    if (typeof node.description === 'string' || (node.meta && typeof node.meta.description === 'string')) {
      output += `<div>${node.description || node.meta.description}</div>`;
    }

    return output;
  }

  return (
    <div className="node-visible-element" data-tip={tooltip()} data-place="top" data-html style={style}>
      <div className="node-name">{title || node.title || node.name}</div>
      {uuid === node.meta.prov['hubmap:uuid'] && <Asterisk aria-label="">*</Asterisk>}
    </div>
  );
}

export default NodeElement;
