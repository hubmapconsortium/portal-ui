import React from 'react';
import PropTypes from 'prop-types';

import { InternalLink } from 'js/shared-styles/Links';

function LinkButton({ linkComponent: LinkComponent, children, ...rest }) {
  return (
    <LinkComponent component="button" {...rest}>
      {children}
    </LinkComponent>
  );
}

LinkButton.propTypes = {
  /**
   Either MaterialUI's `Link` functional component or a component derived from it.
  */
  linkComponent: PropTypes.func,
};

LinkButton.defaultProps = {
  linkComponent: InternalLink,
};

export default LinkButton;
