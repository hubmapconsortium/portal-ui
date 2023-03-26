import React from 'react';

import Panel from 'js/shared-styles/panels/Panel';
import { PanelScrollBox } from './style';

function PanelList({ panelsProps }) {
  return (
    <PanelScrollBox>
      {panelsProps.map((props) => (
        <Panel {...props} />
      ))}
    </PanelScrollBox>
  );
}

export default PanelList;
