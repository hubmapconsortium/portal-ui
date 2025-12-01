import React from 'react';

import { useProvenanceStore, ProvenanceStoreType } from '../ProvContext';
import { ESEntityType } from 'js/components/types';
import ProvVis from '../ProvVis';
import { StyledDiv } from './style';
import DetailPanel from './DetailPanel';
import { ProvData } from '../types';

const useProvenanceStoreSelector = (state: ProvenanceStoreType) => ({
  selectedNodeId: state.selectedNodeId,
  nodes: state.nodes,
});

const getNameForActivity = (idKey: string) => (id: string, prov?: ProvData) => {
  if (!prov) return id;
  const activity = prov.activity[id];
  return `${activity['hubmap:creation_action']} - ${activity[idKey]}`;
};

const getNameForEntity = (typeKey: string, idKey: string) => (id: string, prov?: ProvData) => {
  if (!prov) return id;
  const entity = prov.entity[id];
  // NOTE: The initial entity node was not included in the sample data;
  // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
  return entity ? `${entity[typeKey]} - ${entity[idKey]}` : id;
};

interface ProvGraphProps {
  provData?: ProvData;
  entity_type: ESEntityType;
  uuid: string;
}

function ProvGraph({ provData, entity_type, uuid: currentPageUuid }: ProvGraphProps) {
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
      <ProvVis
        provData={provData}
        getNameForActivity={getNameForActivity(idKey)}
        getNameForEntity={getNameForEntity(typeKey, idKey)}
        entity_type={entity_type}
      />
      {selectedNodeProv && (
        <DetailPanel
          getNameForActivity={getNameForActivity(idKey)}
          getNameForEntity={getNameForEntity(typeKey, idKey)}
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
