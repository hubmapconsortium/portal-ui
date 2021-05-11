import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';

function AncestorNote(props) {
  const { entity } = props;

  let message = '...';
  if (entity) {
    const { entity_type, uuid, display_doi } = entity;
    const lcType = entity_type.toLowerCase();
    const dataTypes = (entity?.mapped_data_types || []).join('/');
    message = (
      <>
        Derived from {dataTypes} {lcType}{' '}
        <LightBlueLink href={`/browse/${lcType}/${uuid}`}>{display_doi}</LightBlueLink>
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
