import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Panel from '../Panel';

function Collections(props) {
  const { entityEndpoint } = props;
  const [collectionsData, setCollectionsData] = useState();
  useEffect(() => {
    async function getAllCollections() {
      const response = await fetch(`${entityEndpoint}/collections`, {
        method: 'GET',
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const data = await response.json();
      setCollectionsData(data);
    }
    getAllCollections();
  }, [entityEndpoint]);

  return (
    <div>
      <Typography variant="h1" component="h1">
        Collections
      </Typography>
      <Typography variant="subtitle1" color="primary">
        {collectionsData && `${collectionsData.length + 1} Collections`}
      </Typography>
      {collectionsData && collectionsData.map((col) => <Panel key={col.uuid} data={col} />)}
    </div>
  );
}

export default Collections;
