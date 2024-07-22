import React, { useEffect } from 'react';

import useProvenanceStore, { ProvenanceStore } from 'js/stores/useProvenanceStore';
import { ESEntityType } from 'js/components/types';
import ProvVis from '../ProvVis';
import { StyledDiv, maxGraphHeight } from './style';
import '@hms-dbmi-bgm/react-workflow-viz/dist/react-workflow-viz.min.css';
import DetailPanel from './DetailPanel';
import { ProvData, ProvNode } from '../types';

const setUUIDSelector = (state: ProvenanceStore) => state.setUUID;
const hasRenderedSelector = (state: ProvenanceStore) => state.hasRendered;

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
  provData: ProvData;
  entity_type: ESEntityType;
  uuid: string;
}

function ProvGraph({ provData, entity_type, uuid }: ProvGraphProps) {
  const isOld = 'ex' in provData.prefix;
  const idKey = isOld ? 'hubmap:displayDOI' : 'hubmap:hubmap_id';
  const timeKey = isOld ? 'prov:generatedAtTime' : 'hubmap:created_timestamp';
  const typeKey = isOld ? 'prov:type' : 'hubmap:entity_type';

  const setUUID = useProvenanceStore(setUUIDSelector);
  const hasRendered = useProvenanceStore(hasRenderedSelector);

  useEffect(() => {
    setUUID(uuid);
  }, [setUUID, uuid]);

  function renderDetailPane(node: ProvNode) {
    if (node?.meta?.prov) {
      return (
        <DetailPanel
          getNameForActivity={getNameForActivity(idKey)}
          getNameForEntity={getNameForEntity(typeKey, idKey)}
          prov={node.meta.prov}
          timeKey={timeKey}
          uuid={uuid}
          idKey={idKey}
          typeKey={typeKey}
        />
      );
    }
    return null;
  }

  // Set vertical scroll position to halfway.
  useEffect(() => {
    if (hasRendered) {
      const scrollEl = document.getElementsByClassName('scroll-container-wrapper')[0];
      // Prevent crash when switching between ProvTabs quickly
      if (scrollEl) {
        scrollEl.scroll({
          top: Math.floor((scrollEl.scrollHeight - maxGraphHeight) / 2),
          behavior: 'instant',
        });
      }
    }
  }, [hasRendered]);

  return (
    <StyledDiv>
      <ProvVis
        provData={provData}
        getNameForActivity={getNameForActivity(idKey)}
        getNameForEntity={getNameForEntity(typeKey, idKey)}
        renderDetailPane={renderDetailPane}
        entity_type={entity_type}
      />
    </StyledDiv>
  );
}

export default ProvGraph;
