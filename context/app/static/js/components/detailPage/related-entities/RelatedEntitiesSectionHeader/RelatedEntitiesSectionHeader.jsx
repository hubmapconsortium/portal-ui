import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from './style';

function RelatedEntitiesSectionHeader({ header, searchPageHref, iconTooltipText }) {
  return (
    <SpacedSectionButtonRow
      leftText={
        <div>
          <StyledSectionHeader iconTooltipText={iconTooltipText}>
            {header}
            <SecondaryBackgroundTooltip title="Samples and datasets derived from this donor.">
              <InfoIcon fontSize="small" color="primary" />
            </SecondaryBackgroundTooltip>
          </StyledSectionHeader>
        </div>
      }
      buttons={
        <Button
          variant="contained"
          color="primary"
          component="a"
          href={searchPageHref}
          data-testid="view-related-data-button"
        >
          View Data on Search Page
        </Button>
      }
    />
  );
}

export default RelatedEntitiesSectionHeader;
