import React from 'react';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import BulletedList from 'js/shared-styles/lists/bulleted-lists/BulletedList';
import BulletedListItem from 'js/shared-styles/lists/bulleted-lists/BulletedListItem';

function CorrespondingAuthorsList({ contacts }) {
  return (
    <BulletedList>
      {contacts.map((contact) => (
        <BulletedListItem key={contact.name}>
          {contact.name}
          &nbsp;
          <OutboundIconLink href={`https://orcid.org/${contact.orcid_id}`}>{contact.orcid_id}</OutboundIconLink>
        </BulletedListItem>
      ))}
    </BulletedList>
  );
}

export default CorrespondingAuthorsList;
