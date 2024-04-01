import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns/format';

import Tile from 'js/shared-styles/tiles/Tile';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { FooterIcon } from './style';

function EntityTileFooter({ last_modified_timestamp, invertColors, descendantCounts }) {
  return (
    <>
      {Object.entries(descendantCounts).map(([k, v]) => (
        <React.Fragment key={k}>
          {k in entityIconMap && <FooterIcon component={entityIconMap[k]} />}
          <Tile.Text>{v}</Tile.Text>
          <Tile.Divider invertColors={invertColors} />
        </React.Fragment>
      ))}
      {last_modified_timestamp && <Tile.Text>Modified {format(last_modified_timestamp, 'yyyy-MM-dd')}</Tile.Text>}
    </>
  );
}

EntityTileFooter.propTypes = {
  last_modified_timestamp: PropTypes.number,
  descendantCounts: PropTypes.shape({ Dataset: PropTypes.number, Sample: PropTypes.number }),
  invertColors: PropTypes.bool,
};

EntityTileFooter.defaultProps = {
  last_modified_timestamp: undefined,
  descendantCounts: {},
  invertColors: false,
};

export default EntityTileFooter;
