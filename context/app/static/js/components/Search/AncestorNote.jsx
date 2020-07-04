import React from 'react';
import Typography from '@material-ui/core/Typography';
import { readCookie } from '../../helpers/functions';

function AncestorNote(props) {
  const { uuid, elasticsearchEndpoint } = props;
  const [ancestor, setAncestor] = React.useState(undefined);
  React.useEffect(() => {
    async function getAndSetAncestor() {
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
      const entity = results.hits.hits[0]._source;
      setAncestor(entity);
    }
    getAndSetAncestor();
  }, [elasticsearchEndpoint, uuid]);

  let message = '...';
  if (ancestor) {
    const { entity_type, uuid: ancestorUUID, display_doi } = ancestor;
    const lcType = entity_type.toLowerCase();
    message = (
      <>
        Derived from {lcType} <a href={`/browse/${lcType}/${ancestorUUID}`}>{display_doi}</a>
      </>
    );
  }
  return <Typography component="h2">{message}</Typography>;
}

export default AncestorNote;
