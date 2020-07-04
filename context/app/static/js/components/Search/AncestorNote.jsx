import React from 'react';
import PropTypes from 'prop-types';
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

AncestorNote.propTypes = {
  entity: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    entity_type: PropTypes.string.isRequired,
    display_doi: PropTypes.string.isRequired,
  }),
};

AncestorNote.defaultProps = {
  entity: undefined,
};

export default AncestorNote;
