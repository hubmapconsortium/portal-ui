import React from 'react';
import PropTypes from 'prop-types';
import { getAuthHeaderIfNexusTokenCookieExists } from './functions';

function LookupEntity(props) {
  const { uuid, elasticsearchEndpoint } = props;
  const [entity, setEntity] = React.useState(undefined);
  const authHeader = getAuthHeaderIfNexusTokenCookieExists();
  React.useEffect(() => {
    async function getAndSetEntity() {
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
  }, [elasticsearchEndpoint, uuid]);

  return React.cloneElement(props.children, { entity });
}

LookupEntity.propTypes = {
  uuid: PropTypes.string.isRequired,
  elasticsearchEndpoint: PropTypes.string.isRequired,
};

export default LookupEntity;
