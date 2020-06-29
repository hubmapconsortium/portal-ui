import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { readCookie } from 'helpers/functions';

function Collection(props) {
  const { entityEndpoint, uuid } = props;
  const [collectionData, setCollectionData] = useState();
  useEffect(() => {
    async function getAllCollections() {
      const nexus_token = readCookie('nexus_token');
      const requestInit = nexus_token
        ? {
            headers: {
              Authorization: `Bearer ${nexus_token}`,
            },
          }
        : {};
      const response = await fetch(`${entityEndpoint}/collections/${uuid}`, requestInit);
      if (!response.ok) {
        console.error('Entity API failed', response);
        return;
      }
      const data = await response.json();
      // eslint-disable-next-line no-console
      console.log(data);
      setCollectionData(data);
    }
    getAllCollections();
  }, [entityEndpoint, uuid]);

  return <div>{collectionData && collectionData.uuid}</div>;
}

export default Collection;
