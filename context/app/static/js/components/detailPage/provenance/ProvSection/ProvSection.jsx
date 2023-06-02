import React, { useContext } from 'react';
import { AppContext, useFlaskDataContext } from 'js/components/Providers';
import useProvData from 'js/hooks/useProvData';
import { Alert } from 'js/shared-styles/alerts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import ProvTabs from '../ProvTabs';

function ProvSection() {
  const {
    entity: { uuid, entity_type },
  } = useFlaskDataContext();
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
        <ProvTabs provData={provData} />
      ) : (
        <Alert severity="warning">
          {`We were unable to retrieve provenance information for this ${entity_type.toLowerCase()}.`}
        </Alert>
      )}
    </DetailPageSection>
  );
}

export default ProvSection;
