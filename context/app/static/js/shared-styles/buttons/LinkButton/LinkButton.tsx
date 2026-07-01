import React, { ElementType, PropsWithChildren } from 'react';

import { InternalLink } from 'js/shared-styles/Links';

interface LinkButtonProps {
  linkComponent?: ElementType;
  [key: string]: unknown;
}

function LinkButton({
  linkComponent: LinkComponent = InternalLink,
  children,
  ...rest
}: PropsWithChildren<LinkButtonProps>) {
  return (
    <LinkComponent component="button" {...rest}>
      {children}
    </LinkComponent>
  );
}

export default LinkButton;
