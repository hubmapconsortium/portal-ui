import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';

import { useFlaskDataContext } from 'js/components/Contexts';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from './style';

function RelatedEntitiesSectionHeader({ header, searchPageHref, iconTooltipText }) {
  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  const tooltipTexts = {
    Donor: 'Samples and datasets derived from this donor.',
    Sample: 'Datasets derived from this sample.',
    Dataset: 'These datasets include those that have additional processing, such as visualizations.',
  };

  return (
    <SpacedSectionButtonRow
      leftText={
        <div>
          <StyledSectionHeader iconTooltipText={iconTooltipText}>
            {header}
            <SecondaryBackgroundTooltip title={tooltipTexts[entity_type]}>
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
