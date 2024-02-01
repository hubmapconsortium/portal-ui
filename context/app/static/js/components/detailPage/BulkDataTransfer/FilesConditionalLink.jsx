import React from 'react';
import PropTypes from 'prop-types';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function getOutboundLinkComponent(hasIcon) {
  if (hasIcon) {
    return OutboundIconLink;
  }
  return OutboundLink;
}
function FilesConditionalLink({ hasAgreedToDUA, openDUA, href, fileName, hasIcon = false, ...rest }) {
  const Link = getOutboundLinkComponent(hasIcon);

  if (hasAgreedToDUA) {
    return (
      <Link href={href} {...rest}>
        {fileName}
      </Link>
    );
  }

  return (
    <Link
      onClick={() => {
        openDUA();
      }}
      component="button"
      underline="none"
      {...rest}
    >
      {fileName}
    </Link>
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
