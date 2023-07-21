import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DetailPageSection } from 'js/components/detailPage/style';
import { buildCollectionsPanelsProps } from 'js/pages/Collections/utils';

import PanelList from 'js/shared-styles/panels/PanelList';
import { StyledSectionHeader } from './style';

function CollectionsSection({ collectionsData }) {
  const panelsProps = buildCollectionsPanelsProps(collectionsData);
  return (
    <DetailPageSection id="collections">
      <StyledSectionHeader>
        Collections
        <SecondaryBackgroundTooltip title="List of collections that contain this dataset.">
          <InfoIcon fontSize="small" color="primary" />
        </SecondaryBackgroundTooltip>
      </StyledSectionHeader>
      <PanelList panelsProps={panelsProps} />
    </DetailPageSection>
  );
}

export default CollectionsSection;
