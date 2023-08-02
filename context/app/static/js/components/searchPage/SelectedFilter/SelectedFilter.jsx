import React from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from 'js/helpers/trackers';
import { Typography } from '@mui/material';

import { StyledCancelIcon, SelectedFilterDiv } from './style';

function SelectedFilter({ labelKey, labelValue, removeFilter, filterId, analyticsCategory }) {
  if (filterId === 'entity_type') {
    return null;
  }

  function onClickWithTracking() {
    trackEvent({
      category: analyticsCategory,
      action: 'Unselect Facet Chip',
      label: `${labelKey}: ${labelValue}`,
    });
    removeFilter();
  }

  return (
    <SelectedFilterDiv>
      <Typography variant="body2">
        {labelKey}: {labelValue}
      </Typography>
      <StyledCancelIcon onClick={onClickWithTracking} />
    </SelectedFilterDiv>
  );
}

SelectedFilter.propTypes = {
  labelKey: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  filterId: PropTypes.string.isRequired,
  removeFilter: PropTypes.func.isRequired,
};

export default SelectedFilter;
