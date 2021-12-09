import React from 'react';
import PropTypes from 'prop-types';
import useEntityData from 'js/hooks/useEntityData';

function LookupEntity({ uuid, children }) {
  const entity = useEntityData(uuid);

  return React.cloneElement(children, { entity });
}

LookupEntity.propTypes = {
  uuid: PropTypes.string.isRequired,
  elasticsearchEndpoint: PropTypes.string.isRequired,
  groupsToken: PropTypes.string.isRequired,
};

export default LookupEntity;
