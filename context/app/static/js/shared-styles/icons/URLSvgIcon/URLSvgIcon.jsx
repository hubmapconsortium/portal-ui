import React from 'react';

import { StyledImage } from './style';

function URLSvgIcon({ iconURL, ariaLabel, ...rest }) {
  return <StyledImage iconURL={iconURL} role="img" aria-label={ariaLabel} {...rest} />;
}

export default URLSvgIcon;
