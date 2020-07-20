import React from 'react';
import format from 'date-fns/format';
import Typography from '@material-ui/core/Typography';

import { FixedWidthFlex, StyledDivider, StyledDatasetIcon, StyledSampleIcon } from './style';

function EntityTileBottom(props) {
  const { invertColors, entityData, descendantCounts } = props;

  return (
    <FixedWidthFlex $invertColors={invertColors}>
      {Object.entries(descendantCounts).map(([k, v]) => (
        <>
          {k === 'Dataset' && <StyledDatasetIcon />}
          {k === 'Sample' && <StyledSampleIcon />}
          <Typography variant="body2">{v}</Typography>
          <StyledDivider flexItem orientation="vertical" $invertColors={invertColors} />
        </>
      ))}
      <Typography variant="body2">Modified {format(entityData.last_modified_timestamp, 'MM-dd-yyyy')}</Typography>
    </FixedWidthFlex>
  );
}

export default EntityTileBottom;
