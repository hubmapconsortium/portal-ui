import React from 'react';

import Graph, { GraphParser } from '@hms-dbmi-bgm/react-workflow-viz';

import ProvData from './ProvData';

export default function ProvVis(props) {
  const { prov, getNameForActivity, getNameForEntity, renderDetailPane } = props;
  const steps = new ProvData(prov, getNameForActivity, getNameForEntity).toCwl();
  // eslint-disable-next-line consistent-return
  function renderDetailPaneWithNode(node) {
    if (renderDetailPane && node) {
      return renderDetailPane(node.meta.prov);
    }
  }
  return (
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
  );
}
