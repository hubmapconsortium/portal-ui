import React from 'react';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';

function HelpLink(props) {
  return (
    <EmailIconLink email="help@hubmapconsortium.org" {...props}>
      help@hubmapconsortium.org
    </EmailIconLink>
  );
}

export default HelpLink;
