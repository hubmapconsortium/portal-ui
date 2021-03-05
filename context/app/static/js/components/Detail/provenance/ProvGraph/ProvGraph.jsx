import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import SectionItem from 'js/components/Detail/SectionItem';
import { LightBlueLink } from 'js/shared-styles/Links';
import { AppContext } from 'js/components/Providers';
import useImmediateDescendantProv from 'js/hooks/useImmediateDescendantProv';
import useProvenanceStore from 'js/stores/useProvenanceStore';
import ProvVis from '../ProvVis';
import { FlexPaper } from './style';
import '@hms-dbmi-bgm/react-workflow-viz/dist/react-workflow-viz.min.css';
import ProvData from '../ProvVis/ProvData';

function createStepNameSet(steps) {
  return new Set(steps.map((step) => step.name));
}

function removeExistingSteps(steps, newSteps) {
  const nameSet = createStepNameSet(steps);
  const uniqueNewSteps = newSteps.filter((step) => !nameSet.has(step.name));
  return uniqueNewSteps;
}

const useProvenanceStoreSelector = (state) => ({ steps: state.steps, addDescendantSteps: state.addDescendantSteps });

function ProvGraph(props) {
  const { provData } = props;
  const isOld = 'ex' in provData.prefix;
  const idKey = isOld ? 'hubmap:displayDOI' : 'hubmap:hubmap_id';
  const timeKey = isOld ? 'prov:generatedAtTime' : 'hubmap:created_timestamp';
  const typeKey = isOld ? 'prov:type' : 'hubmap:entity_type';

  function getNameForActivity(id, prov) {
    const activity = prov.activity[id];
    return `${activity['hubmap:creation_action']} - ${activity[idKey]}`;
  }

  function getNameForEntity(id, prov) {
    const entity = prov.entity[id];
    // NOTE: The initial entity node was not included in the sample data;
    // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
    return entity ? `${entity[typeKey]} - ${entity[idKey]}` : id;
  }

  function renderDetailPane(node) {
    function DetailPanel() {
      const { prov } = node.meta;

      const { elasticsearchEndpoint, entityEndpoint, nexusToken } = useContext(AppContext);
      const { steps, addDescendantSteps } = useProvenanceStore(useProvenanceStoreSelector);
      const [newSteps, setNewSteps] = useState([]);

      const { immediateDescendantsProvData } = useImmediateDescendantProv(
        prov[idKey],
        elasticsearchEndpoint,
        entityEndpoint,
        nexusToken,
      );

      useEffect(() => {
        if (immediateDescendantsProvData) {
          const immediateDescendantSteps = immediateDescendantsProvData
            .map((result) => new ProvData(result, getNameForActivity, getNameForEntity).toCwl())
            .flat();
          setNewSteps(removeExistingSteps(steps, immediateDescendantSteps));
        }
      }, [immediateDescendantsProvData, steps]);

      function handleShowDescendants() {
        addDescendantSteps(newSteps);
      }

      const typeEl =
        typeKey in prov ? (
          <SectionItem label="Type">{prov[typeKey]}</SectionItem>
        ) : (
          <SectionItem label="Type">{prov['prov:type']}</SectionItem>
        );
      const idEl =
        typeKey in prov && ['Donor', 'Sample', 'Dataset'].includes(prov[typeKey]) ? (
          <SectionItem label="ID" ml>
            <LightBlueLink href={`/browse/${prov[typeKey].toLowerCase()}/${prov['hubmap:uuid']}`}>
              {prov[idKey]}
            </LightBlueLink>
          </SectionItem>
        ) : null;
      const createdEl =
        timeKey in prov ? (
          <SectionItem label="Created" ml>
            {prov[timeKey]}
          </SectionItem>
        ) : null;
      const actionsEl =
        typeKey in prov && ['Donor', 'Sample', 'Dataset'].includes(prov[typeKey]) ? (
          <SectionItem ml>
            <Button
              color="primary"
              variant="contained"
              onClick={handleShowDescendants}
              disabled={newSteps.length === 0}
            >
              Show Derived Entities
            </Button>
          </SectionItem>
        ) : null;
      return (
        <FlexPaper>
          {typeEl}
          {idEl}
          {createdEl}
          {actionsEl}
        </FlexPaper>
      );
    }
    return node?.meta?.prov && <DetailPanel />;
  }

  return (
    <ProvVis
      provData={provData}
      getNameForActivity={getNameForActivity}
      getNameForEntity={getNameForEntity}
      renderDetailPane={renderDetailPane}
    />
  );
}

ProvGraph.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ProvGraph;
