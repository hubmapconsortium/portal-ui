import React from 'react';
import PropTypes from 'prop-types';
import { getAuthHeader } from './functions';

function LookupEntity(props) {
  const { uuid, elasticsearchEndpoint, nexusToken } = props;
  const [entity, setEntity] = React.useState(undefined);
  React.useEffect(() => {
    async function getAndSetEntity() {
      const authHeader = getAuthHeader(nexusToken);
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({ query: { ids: { values: [uuid] } } }),
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const results = await response.json();
      // eslint-disable-next-line no-underscore-dangle
      const resultEntity = results.hits.hits[0]._source;
      setEntity(resultEntity);
    }
    getAndSetEntity();
  }, [nexusToken, elasticsearchEndpoint, uuid]);

  return React.cloneElement(props.children, { entity });
}

LookupEntity.propTypes = {
  uuid: PropTypes.string.isRequired,
  elasticsearchEndpoint: PropTypes.string.isRequired,
  nexusToken: PropTypes.string.isRequired,
};

export default LookupEntity;
