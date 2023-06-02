import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import { FlaskDataContext } from 'js/components/App';
import useProvData from 'js/hooks/useProvData';
import { Alert } from 'js/shared-styles/alerts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import ProvTabs from '../ProvTabs';

function ProvSection() {
  const { entity } = useContext(FlaskDataContext);
  const assayMetadata = entity;

  const { uuid } = assayMetadata;
  const { entity_type } = assayMetadata;
  const { groupsToken, entityEndpoint } = useContext(AppContext);
  const { provData, isLoading } = useProvData(uuid, entityEndpoint, groupsToken);

  if (isLoading) {
    return (
      <DetailPageSection id="provenance">
        <SectionHeader>Provenance</SectionHeader>
      </DetailPageSection>
    );
  }

  return (
    <DetailPageSection id="provenance">
      <SectionHeader>Provenance</SectionHeader>
      {provData ? (
        <ProvTabs uuid={uuid} assayMetadata={assayMetadata} provData={provData} />
      ) : (
        <Alert severity="warning">
          {`We were unable to retrieve provenance information for this ${entity_type.toLowerCase()}.`}
        </Alert>
      )}
    </DetailPageSection>
  );
}

export default ProvSection;
