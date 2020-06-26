import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Panel from '../Panel';
import { PageWrapper, ScrollBox } from './style';

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
    <PageWrapper>
      <Typography variant="h2" component="h1">
        Collections
      </Typography>
      <Typography variant="subtitle1" color="primary">
        {collectionsData && `${collectionsData.length} Collections`}
      </Typography>
      <ScrollBox>
        {collectionsData &&
          collectionsData.map((col) => (
            <Panel key={col.uuid} name={col.name} dataset_uuids={col.dataset_uuids} doi_id={col.doi_id} />
          ))}
      </ScrollBox>
    </PageWrapper>
  );
}

export default Collections;
