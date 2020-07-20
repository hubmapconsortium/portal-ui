import React from 'react';
import format from 'date-fns/format';

import { FixedWidthFlex, StyledDivider, StyledTypography, StyledDatasetIcon, StyledSampleIcon } from './style';

function EntityTileBottom(props) {
  const { isCurrentEntity, entityData, descendantCounts } = props;

  return (
    <FixedWidthFlex $isCurrentEntity={isCurrentEntity}>
      {Object.entries(descendantCounts).map(([k, v]) => (
        <>
          {k === 'Dataset' && <StyledDatasetIcon />}
          {k === 'Sample' && <StyledSampleIcon />}
          <StyledTypography variant="body2">{v}</StyledTypography>
          <StyledDivider flexItem orientation="vertical" />
        </>
      ))}
      <StyledTypography variant="body2" $isCurrentEntity={isCurrentEntity}>
        Modified {format(entityData.last_modified_timestamp, 'MM-dd-yyyy')}
      </StyledTypography>
    </FixedWidthFlex>
  );
}

export default EntityTileBottom;
