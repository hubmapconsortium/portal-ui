/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { StyledLink } from './style';

function ConditionalLink(props) {
  const { hasAgreedToDUA, openDUA, href, children } = props;
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
        openDUA();
      }}
      variant="body1"
      underline="none"
    >
      {children}
    </StyledLink>
  );
}

export default ConditionalLink;
