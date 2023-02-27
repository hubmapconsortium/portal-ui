import React from 'react';
import Typography from '@material-ui/core/Typography';

function buildPublicationsPanelsProps(collections) {
  return collections.map(({ _source }) => ({
    key: _source.uuid,
    href: `/browse/publication/${_source.uuid}`,
    title: _source.title,
    secondaryText: _source.publication_venue,
    rightText: <Typography variant="caption">{`Published: ${_source.publication_date}`}</Typography>,
  }));
}

export { buildPublicationsPanelsProps };
