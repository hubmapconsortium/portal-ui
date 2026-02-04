import React from 'react';

import { LinkProps } from '@mui/material/Link';

import OutboundLink from '../../OutboundLink';
import InternalLink from '../../InternalLink';

interface IconLinkProps extends LinkProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  iconOnLeft?: boolean;
  href?: string;
  isOutbound?: boolean;
  noWrap?: boolean;
}

function IconLink({ children, icon, iconOnLeft, isOutbound, noWrap, ...rest }: IconLinkProps) {
  const LinkComponent = isOutbound ? OutboundLink : InternalLink;

  return (
    <LinkComponent
      {...rest}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: iconOnLeft ? 'row-reverse' : 'row',
        gap: 0.5,
        whiteSpace: noWrap ? 'nowrap' : 'normal',
      }}
    >
      <span>{children}</span>
      {icon}
    </LinkComponent>
  );
}

export default IconLink;
export type { IconLinkProps };
