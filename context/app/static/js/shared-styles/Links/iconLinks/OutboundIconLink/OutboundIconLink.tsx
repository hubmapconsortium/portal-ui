import React from 'react';
import IconLink, {IconLinkProps} from 'js/shared-styles/Links/iconLinks/IconLink';
import { ExternalLinkIcon } from 'js/shared-styles/icons';

type OutboundIconLinkProps = Omit<IconLinkProps, 'isOutbound' | 'icon'>;

function OutboundIconLink(props: OutboundIconLinkProps) {
  return <IconLink {...props} isOutbound icon={<ExternalLinkIcon />}  />;
}

export default OutboundIconLink;
