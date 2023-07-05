import React, { useEffect } from 'react';
import Graph, { GraphParser } from '@hms-dbmi-bgm/react-workflow-viz';

import useProvenanceStore from 'js/stores/useProvenanceStore';
import ProvData from './ProvData';
import NodeElement from '../NodeElement';

const useProvenanceStoreSelector = (state) => ({ steps: state.steps, setSteps: state.setSteps });

function renderNodeElement(node, props) {
  return <NodeElement {...props} node={node} />;
}

export default function ProvVis({ provData, getNameForActivity, getNameForEntity, renderDetailPane, entity_type }) {
  const { steps, setSteps } = useProvenanceStore(useProvenanceStoreSelector);

  useEffect(() => {
    setSteps(new ProvData({ prov: provData, entity_type, getNameForActivity, getNameForEntity }).toCwl());
  }, [provData, getNameForActivity, getNameForEntity, setSteps, entity_type]);
  return (
    <GraphParser
      parsingOptions={{
        parseBasicIO: false,
        showIndirectFiles: true,
        showParameters: false,
        showReferenceFiles: true,
      }}
      parentItem={{ name: 'Is this used?' }}
      steps={steps}
    >
      <Graph
        /* The library makes nodes and edges required props, and that's outside our control. */
        nodes={[]}
        edges={[]}
        rowSpacingType="compact"
        minimumHeight={300}
        renderDetailPane={renderDetailPane}
        renderNodeElement={renderNodeElement}
      />
    </GraphParser>
  );
}
