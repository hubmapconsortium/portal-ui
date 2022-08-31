import React from 'react';
import PropTypes from 'prop-types';

import { StyledPaper, Flex, FlexGrow, TruncatedTypography, TileFooter, StyledDivider } from './style';

function Tile({ href, icon, invertColors, bodyContent, footerContent, tileWidth }) {
  return (
    <a href={href}>
      <StyledPaper $invertColors={invertColors} $tileWidth={tileWidth}>
        <Flex>
          {icon}
          <FlexGrow>{bodyContent}</FlexGrow>
        </Flex>
        <TileFooter $invertColors={invertColors}>{footerContent}</TileFooter>
      </StyledPaper>
    </a>
  );
}

Tile.Title = function TileTitle({ children }) {
  return (
    <TruncatedTypography component="h4" variant="h6">
      {children}
    </TruncatedTypography>
  );
};

Tile.Text = function TileText({ children }) {
  return <TruncatedTypography variant="body2">{children}</TruncatedTypography>;
};

Tile.Divider = function TileDivider({ invertColors }) {
  return <StyledDivider flexItem orientation="vertical" $invertColors={invertColors} />;
};

Tile.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  descendantCounts: PropTypes.shape({ Dataset: PropTypes.number, Sample: PropTypes.number }),
  invertColors: PropTypes.bool,
};

Tile.defaultProps = {
  descendantCounts: {},
  invertColors: false,
};

export default Tile;
