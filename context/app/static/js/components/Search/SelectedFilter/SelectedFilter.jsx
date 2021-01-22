import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';
import { StyledCancelIcon, SelectedFilterDiv } from './style';

function SelectedFilter(props) {
  const { labelKey, labelValue, removeFilter, filterId } = props;
  if (filterId === 'entity_type') {
    return null;
  }
  return (
    <SelectedFilterDiv>
      <Typography variant="body2">
        {labelKey}: {labelValue}
      </Typography>
      <StyledCancelIcon onClick={removeFilter} />
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
