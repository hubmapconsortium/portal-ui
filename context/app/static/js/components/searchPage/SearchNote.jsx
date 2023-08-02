import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';

function SearchNote({ entity, label }) {
  let message = '...';

  if (entity) {
    const { entity_type, uuid, hubmap_id } = entity;
    const lcType = entity_type.toLowerCase();
    const dataTypes = (entity?.mapped_data_types || []).join('/');
    message = (
      <>
        {`${label} ${dataTypes} ${lcType} `}
        <InternalLink href={`/browse/${lcType}/${uuid}`}>{hubmap_id}</InternalLink>
      </>
    );
  }
  return <Typography component="h2">{message}</Typography>;
}

SearchNote.propTypes = {
  entity: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    entity_type: PropTypes.string.isRequired,
    hubmap_id: PropTypes.string.isRequired,
  }),
};

SearchNote.defaultProps = {
  entity: undefined,
};

export default SearchNote;
