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
  return (
    <Typography component="h2">
      {ancestor ? (
        <>
          Derived from {ancestor.entity_type}{' '}
          <a href={`/browse/${ancestor.entity_type}/${ancestor.uuid}`}>{ancestor.display_doi}</a>
        </>
      ) : (
        '...'
      )}
    </Typography>
  );
}

export default AncestorNote;
