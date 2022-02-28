import React from 'react';
import PropTypes from 'prop-types';

import { FlexOutboundLink, FlexLightBlueLink, StyledSpan } from './style';

function IconLink({ children, icon, iconPosition, isOutbound, ...rest }) {
  const LinkComponent = isOutbound ? FlexOutboundLink : FlexLightBlueLink;

  return (
    <LinkComponent {...rest}>
      {iconPosition === 'start' && icon}
      <StyledSpan $iconPosition={iconPosition}>{children}</StyledSpan>
      {iconPosition === 'end' && icon}
    </LinkComponent>
  );
}

IconLink.propTypes = {
  icon: PropTypes.element.isRequired,
  iconPosition: PropTypes.oneOf(['start', 'end']),
  isOutbound: PropTypes.bool,
};

IconLink.defaultProps = {
  iconPosition: 'end',
  isOutbound: false,
};

export default IconLink;
