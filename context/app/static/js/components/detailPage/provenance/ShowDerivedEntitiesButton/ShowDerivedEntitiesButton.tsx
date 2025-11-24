import React, { useEffect, useState } from 'react';
import useImmediateDescendantProv from 'js/hooks/useImmediateDescendantProv';
import useProvenanceStore, { type ProvenanceStore } from 'js/stores/useProvenanceStore';
import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useProvContext } from '../ProvContext';
import { convertProvDataToNodesAndEdges } from '../utils/provToNodesAndEdges';
import { applyLayout } from '../utils/applyLayout';
import { ProvData } from '../types';
import type { Edge, Node } from '@xyflow/react';
import { NodeWithoutPosition } from '../utils/provToNodesAndEdges';

function getUniqueNewNodes(existingNodes: Node[], newNodes: Node[]) {
  const idSet = new Set(existingNodes.map((node) => node.id));
  return newNodes.filter((node) => !idSet.has(node.id));
}

function getUniqueNewEdges(existingEdges: Edge[], newEdges: Edge[]) {
  const idSet = new Set(existingEdges.map((edge) => edge.id));
  return newEdges.filter((edge) => !idSet.has(edge.id));
}

const useProvenanceStoreSelector = (state: ProvenanceStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  uuid: state.uuid,
  addDescendantNodesAndEdges: state.addDescendantNodesAndEdges,
});

interface ShowDerivedEntitiesButtonProps {
  id: string;
  getNameForActivity: (id: string, prov?: ProvData) => string;
  getNameForEntity: (id: string, prov?: ProvData) => string;
}

function ShowDerivedEntitiesButton({ id, getNameForActivity, getNameForEntity }: ShowDerivedEntitiesButtonProps) {
  const { nodes, edges, uuid, addDescendantNodesAndEdges } = useProvenanceStore(useProvenanceStoreSelector);
  const { addUuids } = useProvContext();
  const [newNodes, setNewNodes] = useState<Node[]>([]);
  const [newEdges, setNewEdges] = useState<Edge[]>([]);
  const [descendantUuids, setDescendantUuids] = useState<string[]>([]);

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const { immediateDescendantsProvData } = useImmediateDescendantProv(id);

  useEffect(() => {
    if (immediateDescendantsProvData) {
      // Convert each descendant's prov data to nodes and edges
      const allNewNodes: NodeWithoutPosition[] = [];
      const allNewEdges: Edge[] = [];
      const uuidsToAdd: string[] = [];

      immediateDescendantsProvData.forEach((result) => {
        const { nodes: resultNodes, edges: resultEdges } = convertProvDataToNodesAndEdges(result, {
          currentUuid: uuid,
          getNameForActivity,
          getNameForEntity,
        });
        allNewNodes.push(...resultNodes);
        allNewEdges.push(...resultEdges);

        // Extract UUIDs from the entity data
        Object.values(result.entity).forEach((entity) => {
          if ('hubmap:uuid' in entity && typeof entity['hubmap:uuid'] === 'string') {
            uuidsToAdd.push(entity['hubmap:uuid']);
          }
        });
      });

      // Apply layout to new nodes
      const { nodes: layoutNodes, edges: layoutEdges } = applyLayout(allNewNodes, allNewEdges);

      // Filter out nodes and edges that already exist
      const uniqueNodes = getUniqueNewNodes(nodes, layoutNodes);
      const uniqueEdges = getUniqueNewEdges(edges, layoutEdges);

      setNewNodes(uniqueNodes);
      setNewEdges(uniqueEdges);
      setDescendantUuids(uuidsToAdd);
    }
  }, [immediateDescendantsProvData, nodes, edges, uuid, getNameForActivity, getNameForEntity]);

  function handleShowDescendants() {
    addDescendantNodesAndEdges(newNodes, newEdges);
    addUuids(descendantUuids);
    trackEntityPageEvent({ action: 'Provenance / Graph / View Derived' });
  }

  return (
    <OptDisabledButton
      color="primary"
      variant="contained"
      onClick={handleShowDescendants}
      disabled={newNodes.length === 0}
    >
      Show Derived Entities
    </OptDisabledButton>
  );
}

export { getUniqueNewNodes, getUniqueNewEdges };
export default ShowDerivedEntitiesButton;
