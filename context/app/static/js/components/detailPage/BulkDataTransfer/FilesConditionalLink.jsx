import React from 'react';
import PropTypes from 'prop-types';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import { AlignedLink } from './style';

function getOutboundLinkComponent(hasIcon) {
  if (hasIcon) {
    return OutboundIconLink;
  }
  return OutboundLink;
}
function FilesConditionalLink({ hasAgreedToDUA, openDUA, href, children, hasIcon = false, ...rest }) {
  const Link = getOutboundLinkComponent(hasIcon);

  if (hasAgreedToDUA) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <AlignedLink
      onClick={() => {
        openDUA();
      }}
      component="button"
      underline="none"
      {...rest}
    >
      {children}
    </AlignedLink>
  );
}

FilesConditionalLink.propTypes = {
  hasAgreedToDUA: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  openDUA: PropTypes.func.isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

FilesConditionalLink.defaultProps = {
  hasAgreedToDUA: null,
};

export default FilesConditionalLink;
