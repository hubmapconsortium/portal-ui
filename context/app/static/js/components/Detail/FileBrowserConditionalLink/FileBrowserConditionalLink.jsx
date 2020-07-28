/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { LightBlueLink } from 'shared-styles/Links';

function ConditionalLink(props) {
  const { hasAgreedToDUA, openDUA, href, children, ...rest } = props;
  if (hasAgreedToDUA) {
    return (
      <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={href} {...rest}>
        {children}
      </LightBlueLink>
    );
  }
  return (
    <LightBlueLink
      onClick={() => {
        openDUA();
      }}
      underline="none"
      {...rest}
    >
      {children}
    </LightBlueLink>
  );
}

export default ConditionalLink;
