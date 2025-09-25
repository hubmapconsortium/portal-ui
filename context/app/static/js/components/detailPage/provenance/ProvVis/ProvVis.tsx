import React, { ReactNode, useEffect } from 'react';

import Sigma from 'sigma';

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
      });
    }
    return () => {
      if (sigmaRef.current && sigmaRef.current !== null) {
        sigmaRef.current = null;
      }
    };
  }, [provData, getNameForActivity, getNameForEntity]);

  return <div style={{ width: '100%', height: '600px' }} ref={ref} />;
}
