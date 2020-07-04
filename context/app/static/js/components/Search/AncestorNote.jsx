import React from 'react';
import Typography from '@material-ui/core/Typography';
import { readCookie } from '../../helpers/functions';

function LookupEntity(props) {
  const { uuid, elasticsearchEndpoint } = props;
  const [entity, setEntity] = React.useState(undefined);
  React.useEffect(() => {
    async function getAndSetEntity() {
      const nexus_token = readCookie('nexus_token');
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({ query: { ids: { values: [uuid] } } }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${nexus_token}`,
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

export { LookupEntity };
export default AncestorNote;
