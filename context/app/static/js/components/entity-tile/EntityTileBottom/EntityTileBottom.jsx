import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import Typography from '@material-ui/core/Typography';

import { FixedWidthFlex, StyledDivider, StyledDatasetIcon, StyledSampleIcon } from './style';

function EntityTileBottom(props) {
  const { entityData, invertColors, descendantCounts } = props;

  return (
    <FixedWidthFlex $invertColors={invertColors}>
      {Object.entries(descendantCounts).map(([k, v]) => (
        <React.Fragment key={k}>
          {k === 'Support' && <StyledDatasetIcon />}
          {k === 'Dataset' && <StyledDatasetIcon />}
          {k === 'Sample' && <StyledSampleIcon />}
          <Typography variant="body2">{v}</Typography>
          <StyledDivider flexItem orientation="vertical" $invertColors={invertColors} />
        </React.Fragment>
      ))}
      <Typography variant="body2">Modified {format(entityData.last_modified_timestamp, 'yyyy-MM-dd')}</Typography>
    </FixedWidthFlex>
  );
}

EntityTileBottom.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  descendantCounts: PropTypes.shape({ Dataset: PropTypes.number, Sample: PropTypes.number }),
  invertColors: PropTypes.bool,
};

EntityTileBottom.defaultProps = {
  descendantCounts: {},
  invertColors: false,
};

export default EntityTileBottom;
