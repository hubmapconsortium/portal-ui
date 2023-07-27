import React from 'react';
import PropTypes from 'prop-types';

import { FlexOutboundLink, FlexInternalLink, StyledSpan } from './style';

function IconLink({ children, icon, iconOnLeft, isOutbound, ...rest }) {
  const LinkComponent = isOutbound ? FlexOutboundLink : FlexInternalLink;

  return (
    <LinkComponent {...rest}>
      {iconOnLeft && icon}
      <StyledSpan $iconMargin={iconOnLeft ? 'left' : 'right'}>{children}</StyledSpan>
      {!iconOnLeft && icon}
    </LinkComponent>
  );
}

IconLink.propTypes = {
  icon: PropTypes.element.isRequired,
  iconOnLeft: PropTypes.bool,
  isOutbound: PropTypes.bool,
};

IconLink.defaultProps = {
  iconOnLeft: false,
  isOutbound: false,
};

export default IconLink;
