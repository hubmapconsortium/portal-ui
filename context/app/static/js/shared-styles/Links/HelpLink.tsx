import React, { ComponentProps, PropsWithChildren } from 'react';
import EmailIconLink from './iconLinks/EmailIconLink';

type HelpLinkProps = PropsWithChildren<ComponentProps<typeof EmailIconLink>>;

const helpEmail = 'help@hubmapconsortium.org';

function HelpLink({ children, ...props }: HelpLinkProps) {
  return (
    <EmailIconLink {...props} email={helpEmail}>
      {children ?? helpEmail}
    </EmailIconLink>
  );
}

export default HelpLink;
