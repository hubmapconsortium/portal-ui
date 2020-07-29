import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Panel from 'components/CollectionsPanel';
import { PageWrapper, ScrollBox } from './style';

function Collections(props) {
  const { entityEndpoint } = props;
  const [collectionsData, setCollectionsData] = useState([]);
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

Collections.propTypes = {
  entityEndpoint: PropTypes.string.isRequired,
};

export default Collections;
