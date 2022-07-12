import React from 'react';
import PropTypes from 'prop-types';

import { StyledPaper, Flex, StyledIcon, TruncatedTypography, TileFooter, FooterDivider } from './style';

function Tile({ href, icon, invertColors, bodyContent, footerContent }) {
  return (
    <a href={href}>
      <StyledPaper $invertColors={invertColors}>
        <Flex>
          <StyledIcon component={icon} />
          <div>{bodyContent}</div>
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

Tile.FooterDivider = function TileFooterDivider({ invertColors }) {
  return <FooterDivider flexItem orientation="vertical" $invertColors={invertColors} />;
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
