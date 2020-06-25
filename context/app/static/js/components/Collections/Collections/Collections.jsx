import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { readCookie } from 'helpers/functions';
import Card from '../Card';

function Collections(props) {
  const { entityEndpoint } = props;
  const [collectionsData, setCollectionsData] = useState([]);
  useEffect(() => {
    async function getAllCollections() {
      const response = await fetch(`${entityEndpoint}/collections`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${readCookie('nexus_token')}`,
        },
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
      {collectionsData.map((col) => (
        <Card key={col.uuid} data={col} />
      ))}
    </div>
  );
}

export default Collections;
