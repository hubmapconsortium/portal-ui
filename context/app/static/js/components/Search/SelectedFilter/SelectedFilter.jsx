import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { Typography } from '@material-ui/core';

import { StyledCancelIcon, SelectedFilterDiv } from './style';

function SelectedFilter(props) {
  const { labelKey, labelValue, removeFilter, filterId, analyticsCategory } = props;
  if (filterId === 'entity_type') {
    return null;
  }

  function onClickWithTracking() {
    ReactGA.event({
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
