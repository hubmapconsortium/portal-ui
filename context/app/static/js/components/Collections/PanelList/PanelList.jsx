import React from 'react';

import { Panel, PanelScrollBox } from 'js/shared-styles/panels';

function PanelList({ collectionsData }) {
  return (
    <PanelScrollBox>
      {collectionsData.map(({ _source }) => (
        <Panel
          key={_source.uuid}
          href={`/browse/collection/${_source.uuid}`}
          title={_source.title}
          entityCounts={{ datasets: _source.datasets.length }}
          secondaryText={_source.display_doi}
        />
      ))}
    </PanelScrollBox>
  );
}

export default PanelList;
