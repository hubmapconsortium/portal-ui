import React from 'react';
import PropTypes from 'prop-types';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { AlignedLink } from './style';

function FilesConditionalLink({ hasAgreedToDUA, openDUA, href, children, ...rest }) {
  if (hasAgreedToDUA) {
    return (
      <OutboundLink href={href} {...rest}>
        {children}
      </OutboundLink>
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
