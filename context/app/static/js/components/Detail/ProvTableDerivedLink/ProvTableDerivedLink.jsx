import React from 'react';

import { LinkButton, HoverOverlay } from './style';

function ProvTableDerivedLink(props) {
  const { uuid, type } = props;
  return (
    <LinkButton href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${type}`}>
      <HoverOverlay>View Derived {type}s</HoverOverlay>
    </LinkButton>
  );
}

export default ProvTableDerivedLink;
