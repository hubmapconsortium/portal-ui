import React from 'react';
import ReactDOM from 'react-dom';

import ProvVis from './ProvVis';

function renderProvVis(id, prov, props = {}) {
  const element = document.getElementById(id);
  const { getNameForActivity, getNameForEntity, renderDetailPane } = props;
  ReactDOM.render(
    <ProvVis
      prov={prov}
      getNameForActivity={getNameForActivity}
      getNameForEntity={getNameForEntity}
      renderDetailPane={renderDetailPane}
    />,
    element,
  );
}

export default ProvVis;
export { renderProvVis };
