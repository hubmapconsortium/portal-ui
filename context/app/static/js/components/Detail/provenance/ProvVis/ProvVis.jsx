import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Graph, { GraphParser } from '@hms-dbmi-bgm/react-workflow-viz';

import { AppContext } from 'js/components/Providers';
import { getImmediateDescendantProv } from 'js/hooks/useImmediateDescendantProv';
import ProvData from './ProvData';

function createStepNameSet(steps) {
  const nameSet = new Set([]);
  steps.forEach((step) => nameSet.add(step.name));
  return nameSet;
}

function removeExistingSteps(steps, newSteps) {
  const nameSet = createStepNameSet(steps);
  const uniqueNewSteps = [...newSteps].filter((step) => !nameSet.has(step.name));
  return uniqueNewSteps;
}

export default function ProvVis(props) {
  const { provData, display_doi, getNameForActivity, getNameForEntity, renderDetailPane } = props;
  const defaultSteps = new ProvData(provData, getNameForActivity, getNameForEntity).toCwl();

  const [steps, setSteps] = useState(defaultSteps);

  const { elasticsearchEndpoint, entityEndpoint, nexusToken } = useContext(AppContext);

  async function getMoreSteps() {
    const results = await getImmediateDescendantProv(display_doi, elasticsearchEndpoint, entityEndpoint, nexusToken);
    const moreSteps = results
      .map((result) => new ProvData(result, getNameForActivity, getNameForEntity).toCwl())
      .flat();
    const uniqueNewSteps = removeExistingSteps(steps, moreSteps);

    const stepsCopy = steps;
    stepsCopy[0].outputs[0].target = [
      { step: 'Create Sample Activity - HBM229.JTTG.749', name: 'Donor - HBM546.MHVZ.749' },
    ];
    const x = [...stepsCopy, ...uniqueNewSteps];
    setSteps(x);
  }

  // eslint-disable-next-line consistent-return
  function renderDetailPaneWithNode(node) {
    if (renderDetailPane && node) {
      return renderDetailPane(node.meta.prov, node.name);
    }
  }
  return (
    <>
      <GraphParser
        parsingOptions={{
          parseBasicIO: false,
          showIndirectFiles: true,
          showParameters: false,
          showReferenceFiles: true,
        }}
        parentItem={{ name: 'Is this used?' }}
        steps={steps}
      >
        <Graph rowSpacingType="compact" minimumHeight={300} renderDetailPane={renderDetailPaneWithNode} />
      </GraphParser>
      <Button onClick={() => getMoreSteps()}> Hello </Button>
    </>
  );
}
