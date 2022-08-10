import React from 'react';

function LinkButton({ linkComponent: LinkComponent, children, ...rest }) {
  return (
    <LinkComponent component="button" {...rest}>
      {children}
    </LinkComponent>
  );
}

export default LinkButton;
