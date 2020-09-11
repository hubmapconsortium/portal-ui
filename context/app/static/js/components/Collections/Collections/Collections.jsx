import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import Description from 'js/components/Detail/Description';
import Panel from '../Panel';
import { PageWrapper, ScrollBox } from './style';

function Collections() {
  const [collectionsData, setCollectionsData] = useState([]);
  const { entityEndpoint } = useContext(AppContext);

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
        {collectionsData.length > 0 && `${collectionsData.length} Collections`}
      </Typography>
      <Description>
        Collections of HuBMAP datasets represent data from related experiments—such as assays performed on the same
        organ—or data that has been grouped for other reasons. In the future, it will be possible to reference
        collections through Document Object Identifiers (DOIs).
      </Description>
      <ScrollBox>
        {collectionsData.length > 0 &&
          collectionsData.map((col) => (
            <Panel
              key={col.uuid}
              name={col.name}
              dataset_uuids={col.dataset_uuids}
              doi_id={col.doi_id}
              uuid={col.uuid}
            />
          ))}
      </ScrollBox>
    </PageWrapper>
  );
}

export default Collections;
