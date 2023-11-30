import React from 'react';

import Panel, { PanelProps } from 'js/shared-styles/panels/Panel';
import { PanelScrollBox } from './style';

interface PanelListProps {
  panelsProps: PanelProps[];
}

function PanelList({ panelsProps }: PanelListProps) {
  return (
    <PanelScrollBox>
      {panelsProps.map((props) => (
        <Panel key={'key' in props ? props.key : props.title} {...props} />
      ))}
    </PanelScrollBox>
  );
}

export default PanelList;
