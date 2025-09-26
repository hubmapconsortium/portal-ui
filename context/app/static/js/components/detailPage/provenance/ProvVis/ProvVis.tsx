import React, { ReactNode, useEffect } from 'react';

import Sigma from 'sigma';
import { NodeCircleProgram, EdgeLineProgram, EdgeArrowProgram } from 'sigma/rendering';
import { NodeSquareProgram } from '@sigma/node-square';

import useProvenanceStore, { ProvenanceStore } from 'js/stores/useProvenanceStore';
import ProvData from './ProvData';
import { ProvData as ProvDataType, ProvNode } from '../types';
// import NodeElement from '../NodeElement';
import { parseOpenProvToGraph } from './OpenProvParser';

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

  const ref = React.useRef<HTMLDivElement | null>(null);
  const sigmaRef = React.useRef<Sigma | null>(null);
  useEffect(() => {
    if (ref.current && !sigmaRef.current && provData) {
      const parsed = parseOpenProvToGraph(provData, { getNameForActivity, getNameForEntity });
      sigmaRef.current = new Sigma(parsed, ref.current, {
        renderEdgeLabels: false,
        defaultNodeColor: '#cccccc',
        defaultEdgeColor: '#999999',
        zoomToSizeRatioFunction: (size) => size * 64,
        nodeProgramClasses: {
          circle: NodeCircleProgram,
          square: NodeSquareProgram,
        },
        edgeProgramClasses: {
          line: EdgeLineProgram,
          arrow: EdgeArrowProgram,
        },
        nodeReducer: (node, data) => {
          // Use the node data to override default styling
          const res = { ...data };

          // Override with our custom visual properties if they exist
          if (typeof data.color === 'string') {
            res.color = data.color;
          }
          if (typeof data.size === 'number') {
            res.size = data.size;
          }

          res.type = 'provType' in data && typeof data.provType === 'string' ? data.provType : 'circle';

          return res;
        },
        edgeReducer: (edge, data) => {
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
      });
    }
    return () => {
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
    };
  }, [provData, getNameForActivity, getNameForEntity]);

  return <div style={{ width: '100%', height: '600px' }} ref={ref} />;
}
