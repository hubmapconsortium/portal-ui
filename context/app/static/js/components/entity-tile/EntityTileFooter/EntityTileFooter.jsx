import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import Tile from 'js/shared-styles/tiles/Tile';
import { StyledDatasetIcon, StyledSampleIcon } from './style';

function EntityTileFooter({ entityData, invertColors, descendantCounts }) {
  return (
    <>
      {Object.entries(descendantCounts).map(([k, v]) => (
        <React.Fragment key={k}>
          {k === 'Support' && <StyledDatasetIcon />}
          {k === 'Dataset' && <StyledDatasetIcon />}
          {k === 'Sample' && <StyledSampleIcon />}
          <Tile.Text>{v}</Tile.Text>
          <Tile.Divider invertColors={invertColors} />
        </React.Fragment>
      ))}
      <Tile.Text>Modified {format(entityData.last_modified_timestamp, 'yyyy-MM-dd')}</Tile.Text>
    </>
  );
}

EntityTileFooter.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  descendantCounts: PropTypes.shape({ Dataset: PropTypes.number, Sample: PropTypes.number }),
  invertColors: PropTypes.bool,
};

EntityTileFooter.defaultProps = {
  descendantCounts: {},
  invertColors: false,
};

export default EntityTileFooter;
