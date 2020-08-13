/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import { AlignedLink } from './style';

function FilesConditionalLink(props) {
  const { hasAgreedToDUA, openDUA, href, children, ...rest } = props;
  if (hasAgreedToDUA) {
    return (
      <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={href} {...rest}>
        {children}
      </LightBlueLink>
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
