/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { LightBlueLink } from 'shared-styles/Links';

function ConditionalLink(props) {
  const { hasAgreedToDUA, agreeToDUA, href, children } = props;
  if (hasAgreedToDUA) {
    return (
      <LightBlueLink
        variant="body1"
        target="_blank"
        rel="noopener noreferrer"
        downloadvariant="body1"
        underline="none"
        href={href}
      >
        {children}
      </LightBlueLink>
    );
  }
  return (
    <LightBlueLink
      onClick={() => {
        // eslint-disable-next-line no-alert
        agreeToDUA(window.confirm('Agree to Data Use Agreement?'));
      }}
      variant="body1"
      downloadvariant="body1"
      underline="none"
    >
      {children}
    </LightBlueLink>
  );
}

export default ConditionalLink;
