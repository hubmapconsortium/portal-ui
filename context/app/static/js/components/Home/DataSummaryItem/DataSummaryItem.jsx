import React from 'react';
import PropTypes from 'prop-types';
import { FlexRow, StyledTypography } from './style';

function DataSummaryItem(props) {
  const { value, icon: Icon, label } = props;

  return (
    <FlexRow>
      <Icon color="primary" style={{ fontSize: '36px' }} />
      <StyledTypography component="p" variant="h4">
        {value}
      </StyledTypography>
      <StyledTypography component="p" variant="h4" color="secondary">
        {label}
      </StyledTypography>
    </FlexRow>
  );
}

DataSummaryItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

export default React.memo(DataSummaryItem);
