import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { readCookie } from 'helpers/functions';

import Summary from '../Summary';
import CollectionDatasetsTable from '../CollectionDatasetsTable';

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

  return (
    <div>
      {collectionData && (
        <>
          <Summary
            uuid={collectionData.uuid}
            entity_type={collectionData.entitytype}
            display_doi={collectionData.display_doi}
            collectionName={collectionData.name}
            description={collectionData.description}
          />
          <CollectionDatasetsTable datasets={collectionData.items} />
        </>
      )}
    </div>
  );
}

export default Collection;
