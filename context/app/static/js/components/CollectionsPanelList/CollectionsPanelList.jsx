import React from 'react';
import Typography from '@material-ui/core/Typography';

import { PanelScrollBox } from 'js/shared-styles/panels';
import Panel from 'js/shared-styles/panels/Panel';

function CollectionsPanelList({ collectionsData }) {
  return (
    <PanelScrollBox>
      {collectionsData.map(({ _source }) => (
        <Panel
          key={_source.uuid}
          href={`/browse/collection/${_source.uuid}`}
          title={_source.title}
          secondaryText={_source.hubmap_id}
          rightText={<Typography variant="caption">{`${_source.datasets.length} Datasets`}</Typography>}
        />
      ))}
    </PanelScrollBox>
  );
}

export default CollectionsPanelList;
