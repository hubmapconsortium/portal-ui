import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import useProvData from 'js/hooks/useProvData';
import { Alert } from 'js/shared-styles/alerts';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledSectionHeader } from './style';
import ProvTabs from '../ProvTabs';

function ProvSection() {
  const {
    entity: { uuid, entity_type },
  } = useFlaskDataContext();
  const { groupsToken, entityEndpoint } = useAppContext();
  const { provData, isLoading } = useProvData(uuid, entityEndpoint, groupsToken);

  if (isLoading) {
    return (
      <DetailPageSection id="provenance">
        <StyledSectionHeader>
          Provenance
          <SecondaryBackgroundTooltip title="The provenance shows the sequence of events and actions that led to this page creation.">
            <InfoIcon fontSize="small" color="primary" />
          </SecondaryBackgroundTooltip>
        </StyledSectionHeader>
      </DetailPageSection>
    );
  }

  return (
    <DetailPageSection id="provenance">
      <StyledSectionHeader>
        Provenance
        <SecondaryBackgroundTooltip title="The provenance shows the sequence of events and actions that led to this page creation.">
          <InfoIcon fontSize="small" color="primary" />
        </SecondaryBackgroundTooltip>
      </StyledSectionHeader>
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
