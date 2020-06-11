import React from 'react';
import { FlexRow, StyledTypography } from './style';

function DataSummaryItem(props) {
  const { value, Icon, label } = props;

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

export default React.memo(DataSummaryItem);
