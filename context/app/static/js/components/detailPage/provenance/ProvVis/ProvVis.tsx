import React, { ComponentProps, ReactNode, useEffect } from 'react';
// @ts-expect-error - We have our own type definitions for now
import Graph, { GraphParser } from '@hms-dbmi-bgm/react-workflow-viz';
// Upstream issue: https://github.com/4dn-dcic/react-workflow-viz/issues/43

import useProvenanceStore, { ProvenanceStore } from 'js/stores/useProvenanceStore';
import ProvData from './ProvData';
import { ProvData as ProvDataType, ProvNode } from '../types';
import NodeElement from '../NodeElement';

const useProvenanceStoreSelector = (state: ProvenanceStore) => ({ steps: state.steps, setSteps: state.setSteps });

function renderNodeElement(node: ProvNode, props: ComponentProps<typeof Graph>) {
  return <NodeElement {...props} node={node} />;
}

interface ProvVisProps {
  provData: ProvDataType;
  getNameForActivity: (id: string, prov?: ProvDataType) => string;
  getNameForEntity: (id: string, prov?: ProvDataType) => string;
  renderDetailPane: (node: ProvNode) => ReactNode;
  entity_type: string;
}

export default function ProvVis({
  provData,
  getNameForActivity,
  getNameForEntity,
  renderDetailPane,
  entity_type,
}: ProvVisProps) {
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
