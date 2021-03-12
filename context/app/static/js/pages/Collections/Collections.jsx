import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import PanelList from 'js/components/Collections/PanelList';
import useCollectionsData from 'js/hooks/useCollectionsData';
import { PageWrapper, StyledDescription } from './style';

function Collections() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const collectionsData = useCollectionsData(elasticsearchEndpoint, nexusToken);

  return (
    <PageWrapper>
      <Typography variant="h2" component="h1">
        Collections
      </Typography>
      <Typography variant="subtitle1" color="primary">
        {collectionsData.length > 0 && `${collectionsData.length} Collections`}
      </Typography>
      <StyledDescription>
        Collections of HuBMAP datasets represent data from related experiments—such as assays performed on the same
        organ—or data that has been grouped for other reasons. In the future, it will be possible to reference
        collections through Document Object Identifiers (DOIs).
      </StyledDescription>
      {collectionsData.length > 0 && <PanelList collectionsData={collectionsData} />}
    </PageWrapper>
  );
}

export default Collections;
