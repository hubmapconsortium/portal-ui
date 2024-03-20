import React from 'react';
import Button from '@mui/material/Button';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { useFlaskDataContext } from 'js/components/Contexts';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

const tooltipTexts = {
  Donor: 'Samples and datasets derived from this donor.',
  Sample: 'Datasets derived from this sample.',
  Dataset: 'These datasets include those that have additional processing, such as visualizations.',
};

function RelatedEntitiesSectionHeader({ header, searchPageHref }) {
  const {
    entity: { entity_type, uuid },
  } = useFlaskDataContext();

  const track = useTrackEntityPageEvent();

  return (
    <SpacedSectionButtonRow
      leftText={<SectionHeader iconTooltipText={tooltipTexts[entity_type]}>{header}</SectionHeader>}
      buttons={
        <Button
          variant="contained"
          color="primary"
          component="a"
          href={searchPageHref}
          onClick={() =>
            track({
              action: `Derived Datasets Navigation / Navigate to Derived Datasets Search Page`,
              label: uuid,
            })
          }
          data-testid="view-related-data-button"
        >
          View Data on Search Page
        </Button>
      }
    />
  );
}

export default RelatedEntitiesSectionHeader;
