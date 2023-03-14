import React from 'react';
import Typography from '@material-ui/core/Typography';

function buildCollectionsPanelsProps(collections) {
  return collections.map(({ _source }) => ({
    key: _source.uuid,
    href: `/browse/collection/${_source.uuid}`,
    title: _source.title,
    secondaryText: _source.hubmap_id,
    rightText: <Typography variant="caption">{`${_source.datasets.length} Datasets`}</Typography>,
  }));
}

export { buildCollectionsPanelsProps };
