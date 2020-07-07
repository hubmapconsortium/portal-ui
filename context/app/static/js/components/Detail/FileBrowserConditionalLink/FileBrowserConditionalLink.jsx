/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { StyledLink } from './style';

function ConditionalLink(props) {
  const { hasAgreedToDUA, agreeToDUA, href, children } = props;
  if (hasAgreedToDUA) {
    return (
      <StyledLink variant="body1" target="_blank" rel="noopener noreferrer" download underline="none" href={href}>
        {children}
      </StyledLink>
    );
  }
  return (
    <StyledLink
      onClick={() => {
        // eslint-disable-next-line no-alert
        agreeToDUA(window.confirm('Agree to Data Use Agreement?'));
      }}
      variant="body1"
      underline="none"
    >
      {children}
    </StyledLink>
  );
}

export default ConditionalLink;
