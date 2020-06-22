import React from 'react';
import PropTypes from 'prop-types';
import { StyledTypography, StyledLink } from './style';

function DataSummaryItem(props) {
  const { value, icon: Icon, label, href } = props;

  return (
    <StyledLink href={href}>
      <Icon color="primary" style={{ fontSize: '36px' }} />
      <StyledTypography variant="h4">
        {value} {label}
      </StyledTypography>
    </StyledLink>
  );
}

DataSummaryItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

export default React.memo(DataSummaryItem);
