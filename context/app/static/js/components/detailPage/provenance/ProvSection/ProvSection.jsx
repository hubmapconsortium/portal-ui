import React from 'react';

import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import useProvData from 'js/hooks/useProvData';
import { Alert } from 'js/shared-styles/alerts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import ProvTabs from '../ProvTabs';

const provenanceTooltipText = `The provenance shows the sequence of events and actions that led to this page creation.`;

function ProvSection() {
  const {
    entity: { uuid, entity_type },
  } = useFlaskDataContext();
  const { groupsToken, entityEndpoint } = useAppContext();
  const { provData, isLoading } = useProvData(uuid, entityEndpoint, groupsToken);

  if (isLoading) {
    return (
      <DetailPageSection id="provenance">
        <SectionHeader iconTooltipText={provenanceTooltipText}>Provenance</SectionHeader>
      </DetailPageSection>
    );
  }

  return (
    <DetailPageSection id="provenance">
      <SectionHeader iconTooltipText={provenanceTooltipText}>Provenance</SectionHeader>
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
