import React, { useEffect, useState } from 'react';
import useImmediateDescendantProv from 'js/hooks/useImmediateDescendantProv';
import { useProvenanceStore, type ProvenanceStoreType } from '../ProvContext';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { convertProvDataToNodesAndEdges } from '../utils/provToNodesAndEdges';
import { applyLayout } from '../utils/applyLayout';
import { ProvData } from '../types';
import type { Edge, Node } from '@xyflow/react';
import { NodeWithoutPosition } from '../utils/provToNodesAndEdges';
import { useEventCallback } from '@mui/material/utils';
import Button from '@mui/material/Button';

export function getUniques<T extends { id: string }>(existingItems: T[], newItems: T[]) {
  const idSet = new Set(existingItems.map((item) => item.id));
  return newItems.filter((item) => !idSet.has(item.id));
}

const useProvenanceStoreSelector = (state: ProvenanceStoreType) => ({
  nodes: state.nodes,
  edges: state.edges,
  uuid: state.uuid,
  addDescendantNodesAndEdges: state.addDescendantNodesAndEdges,
  addUuids: state.addUuids,
});

interface ShowDerivedEntitiesButtonProps {
  id: string;
  getNameForActivity: (id: string, prov?: ProvData) => string;
  getNameForEntity: (id: string, prov?: ProvData) => string;
}

function ShowDerivedEntitiesButton({ id, getNameForActivity, getNameForEntity }: ShowDerivedEntitiesButtonProps) {
  const { nodes, edges, uuid, addDescendantNodesAndEdges, addUuids } = useProvenanceStore(useProvenanceStoreSelector);
  const [newNodes, setNewNodes] = useState<Node[]>([]);
  const [newEdges, setNewEdges] = useState<Edge[]>([]);
  const [descendantUuids, setDescendantUuids] = useState<string[]>([]);

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const { immediateDescendantsProvData, isLoading } = useImmediateDescendantProv(id);

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
      const uniqueNodes = getUniques(nodes, layoutNodes);
      const uniqueEdges = getUniques(edges, layoutEdges);

      setNewNodes(uniqueNodes);
      setNewEdges(uniqueEdges);
      setDescendantUuids(uuidsToAdd);
    }
  }, [immediateDescendantsProvData, nodes, edges, uuid, getNameForActivity, getNameForEntity]);

  const handleShowDescendants = useEventCallback(() => {
    addDescendantNodesAndEdges(newNodes, newEdges);
    addUuids(descendantUuids);
    trackEntityPageEvent({ action: 'Provenance / Graph / View Derived' });
  });

  return (
    <Button
      loading={isLoading}
      color="primary"
      variant="contained"
      onClick={handleShowDescendants}
      disabled={newNodes.length === 0}
    >
      Show Derived Entities
    </Button>
  );
}

export default ShowDerivedEntitiesButton;
