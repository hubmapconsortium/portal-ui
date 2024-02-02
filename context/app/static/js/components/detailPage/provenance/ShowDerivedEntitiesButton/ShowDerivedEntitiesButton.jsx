import React, { useEffect, useState } from 'react';
import { useAppContext } from 'js/components/Contexts';
import useImmediateDescendantProv from 'js/hooks/useImmediateDescendantProv';
import useProvenanceStore from 'js/stores/useProvenanceStore';
import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import ProvData from '../ProvVis/ProvData';

function getUniqueNewSteps(steps, newSteps) {
  const nameSet = new Set(steps.map((step) => step.name));
  return newSteps.filter((step) => !nameSet.has(step.name));
}

const useProvenanceStoreSelector = (state) => ({ steps: state.steps, addDescendantSteps: state.addDescendantSteps });

function ShowDerivedEntitiesButton({ id, getNameForActivity, getNameForEntity }) {
  const { elasticsearchEndpoint, entityEndpoint, groupsToken } = useAppContext();
  const { steps, addDescendantSteps } = useProvenanceStore(useProvenanceStoreSelector);
  const [newSteps, setNewSteps] = useState([]);

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const { immediateDescendantsProvData } = useImmediateDescendantProv(
    id,
    elasticsearchEndpoint,
    entityEndpoint,
    groupsToken,
  );

  useEffect(() => {
    if (immediateDescendantsProvData) {
      const immediateDescendantSteps = immediateDescendantsProvData
        .map((result) => new ProvData({ prov: result, getNameForActivity, getNameForEntity }).toCwl())
        .flat();
      setNewSteps(getUniqueNewSteps(steps, immediateDescendantSteps));
    }
  }, [immediateDescendantsProvData, steps, getNameForActivity, getNameForEntity]);
  function handleShowDescendants() {
    addDescendantSteps(newSteps);
    trackEntityPageEvent({ action: 'Provenance / Graph / View Derived' });
  }
  return (
    <OptDisabledButton
      color="primary"
      variant="contained"
      onClick={handleShowDescendants}
      disabled={newSteps.length === 0}
    >
      Show Derived Entities
    </OptDisabledButton>
  );
}

export { getUniqueNewSteps };
export default ShowDerivedEntitiesButton;
