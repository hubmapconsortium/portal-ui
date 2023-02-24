import React from 'react';
import Typography from '@material-ui/core/Typography';

import PanelList from 'js/shared-styles/panels/PanelList';

function CollectionsPanelList({ collectionsData }) {
  const panelsProps = collectionsData.map(({ _source }) => ({
    key: _source.uuid,
    href: `/browse/collection/${_source.uuid}`,
    title: _source.title,
    secondaryText: _source.hubmap_id,
    rightText: <Typography variant="caption">{`${_source.datasets.length} Datasets`}</Typography>,
  }));

  return <PanelList panelsProps={panelsProps} />;
}

export default CollectionsPanelList;
