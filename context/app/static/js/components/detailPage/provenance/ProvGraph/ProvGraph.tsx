import React from 'react';

import { useProvenanceStore, ProvenanceStoreType } from '../ProvContext';
import { ESEntityType } from 'js/components/types';
import ProvVis from '../ProvVis';
import { StyledDiv } from './style';
import DetailPanel from './DetailPanel';
import { ProvData } from '../types';
import { createGetNameForActivity, createGetNameForEntity } from '../utils/nameFormatters';

const useProvenanceStoreSelector = (state: ProvenanceStoreType) => ({
  selectedNodeId: state.selectedNodeId,
  nodes: state.nodes,
});

interface ProvGraphProps {
  provData?: ProvData;
  entity_type: ESEntityType;
  uuid: string;
}

function ProvGraph({ provData, uuid: currentPageUuid }: ProvGraphProps) {
  const isOld = provData && 'ex' in provData?.prefix;
  const idKey = isOld ? 'hubmap:displayDOI' : 'hubmap:hubmap_id';
  const timeKey = isOld ? 'prov:generatedAtTime' : 'hubmap:created_timestamp';
  const typeKey = isOld ? 'prov:type' : 'hubmap:entity_type';

  const { selectedNodeId, nodes } = useProvenanceStore(useProvenanceStoreSelector);

  // Find the selected node to display in detail panel
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedNodeProv = selectedNode?.data?.prov as Record<string, string> | undefined;

  if (!provData) {
    return 'No provenance data available.';
  }

  return (
    <StyledDiv>
      <ProvVis />
      {selectedNodeProv && (
        <DetailPanel
          getNameForActivity={createGetNameForActivity(idKey)}
          getNameForEntity={createGetNameForEntity(typeKey, idKey)}
          prov={selectedNodeProv}
          timeKey={timeKey}
          uuid={currentPageUuid}
          idKey={idKey}
          typeKey={typeKey}
        />
      )}
    </StyledDiv>
  );
}

export default ProvGraph;
