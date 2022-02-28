import React from 'react';
import IconLink from 'js/shared-styles/Links/iconLinks/IconLink';
import { ExternalLinkIcon } from 'js/shared-styles/icons';

function OutboundIconLink({ iconFontSize, ...rest }) {
  return <IconLink isOutbound icon={<ExternalLinkIcon fontSize={iconFontSize} />} {...rest} />;
}

export default OutboundIconLink;
