import React from 'react';
import Typography from '@material-ui/core/Typography';

function AncestorNote(props) {
  const { entity } = props;

  let message = '...';
  if (entity) {
    const { entity_type, uuid, display_doi } = entity;
    const lcType = entity_type.toLowerCase();
    message = (
      <>
        Derived from {lcType} <a href={`/browse/${lcType}/${uuid}`}>{display_doi}</a>
      </>
    );
  }
  return <Typography component="h2">{message}</Typography>;
}

export default AncestorNote;
