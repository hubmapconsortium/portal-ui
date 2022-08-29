import React from 'react';

import { LinkButton } from './style';

function ProvTableDerivedLink({ uuid, type }) {
  return <LinkButton href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${type}`}>View Derived {type}s</LinkButton>;
}

export default ProvTableDerivedLink;
