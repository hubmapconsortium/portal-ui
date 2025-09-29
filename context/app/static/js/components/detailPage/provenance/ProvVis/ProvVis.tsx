import React, { ReactNode, useEffect } from 'react';
import type { Attributes } from 'graphology-types';

import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import { NodeCircleProgram, EdgeLineProgram, EdgeArrowProgram } from 'sigma/rendering';
import { NodeSquareProgram } from '@sigma/node-square';

import useProvenanceStore, { ProvenanceStore } from 'js/stores/useProvenanceStore';
import ProvData from './ProvData';
import { ProvData as ProvDataType, ProvNode } from '../types';
// import NodeElement from '../NodeElement';
import { parseOpenProvToGraph } from './OpenProvParser';
import { RectangleNodeProgram } from './RectangleNodeProgram';

interface NodeAttributes extends Attributes {
  color?: string;
  size?: number;
  type?: string;
  provType?: string;
  [key: string]: unknown;
}

interface EdgeAttributes extends Attributes {
  type?: string;
  color?: string;
  size?: number;
  [key: string]: unknown;
}

const useProvenanceStoreSelector = (state: ProvenanceStore) => ({ steps: state.steps, setSteps: state.setSteps });

// function renderNodeElement(node: ProvNode, props: ComponentProps<typeof Graph>) {
//   return <NodeElement {...props} node={node} />;
// }

interface ProvVisProps {
  provData: ProvDataType;
  getNameForActivity: (id: string, prov?: ProvDataType) => string;
  getNameForEntity: (id: string, prov?: ProvDataType) => string;
  renderDetailPane: (node: ProvNode) => ReactNode;
  entity_type: string;
}

// Child component that uses React Sigma hooks
function GraphRenderer({
  provData,
  getNameForActivity,
  getNameForEntity,
}: {
  provData: ProvDataType;
  getNameForActivity: (id: string, prov?: ProvDataType) => string;
  getNameForEntity: (id: string, prov?: ProvDataType) => string;
}) {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    if (provData) {
      const parsed = parseOpenProvToGraph(provData, { getNameForActivity, getNameForEntity });
      console.log({ parsed });
      loadGraph(parsed);
    }
  }, [provData, getNameForActivity, getNameForEntity, loadGraph]);

  return null; // This component doesn't render anything visible
}

export default function ProvVis({
  provData,
  getNameForActivity,
  getNameForEntity,
  // renderDetailPane,
  entity_type,
}: ProvVisProps) {
  const { /*steps,*/ setSteps } = useProvenanceStore(useProvenanceStoreSelector);

  useEffect(() => {
    setSteps(new ProvData({ prov: provData, entity_type, getNameForActivity, getNameForEntity }).toCwl());
  }, [provData, getNameForActivity, getNameForEntity, setSteps, entity_type]);

  const sigmaSettings = {
    renderEdgeLabels: false,
    renderLabels: true, // Fixed: use 'renderLabels' instead of 'renderNodeLabels'
    defaultNodeColor: '#cccccc',
    defaultEdgeColor: '#999999',
    nodeProgramClasses: {
      circle: NodeCircleProgram,
      square: NodeSquareProgram,
      rectangle: RectangleNodeProgram,
    },
    edgeProgramClasses: {
      line: EdgeLineProgram,
      arrow: EdgeArrowProgram,
    },
    nodeReducer: (node: string, data: NodeAttributes) => {
      // Use the node data to override default styling
      const res = { ...data };

      // Override with our custom visual properties if they exist
      if (typeof data.color === 'string') {
        res.color = data.color;
      }
      if (typeof data.size === 'number') {
        res.size = data.size;
      }

      // Set node type based on provType, default to rectangle to showcase our custom program
      res.type = data.provType ?? 'rectangle';

      return res;
    },
    edgeReducer: (edge: string, data: EdgeAttributes) => {
      // Configure edge rendering based on edge type
      const res = { ...data };

      // Map provenance edge types to visual representations
      if (data.type === 'used') {
        res.type = 'arrow';
        res.color = '#666666';
        res.size = 2;
      } else if (data.type === 'wasGeneratedBy') {
        res.type = 'arrow';
        res.color = '#444444';
        res.size = 2;
      } else if (data.type === 'actedOnBehalfOf') {
        res.type = 'line';
        res.color = '#888888';
        res.size = 1;
      } else {
        // Default edge type
        res.type = 'line';
        res.color = '#999999';
        res.size = 1;
      }

      return res;
    },
  } satisfies Parameters<typeof SigmaContainer>[0]['settings'];

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <SigmaContainer settings={sigmaSettings}>
        <GraphRenderer
          provData={provData}
          getNameForActivity={getNameForActivity}
          getNameForEntity={getNameForEntity}
        />
      </SigmaContainer>
    </div>
  );
}
