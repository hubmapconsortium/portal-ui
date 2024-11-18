import React from 'react';
import { ContactAPIResponse, normalizeContact } from 'js/components/detailPage/ContributorsTable/utils';
import { isValidOrcidId } from 'js/helpers/functions';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import BulletedList from 'js/shared-styles/lists/bulleted-lists/BulletedList';
import BulletedListItem from 'js/shared-styles/lists/bulleted-lists/BulletedListItem';

function CorrespondingAuthorsList({ contacts }: { contacts: ContactAPIResponse[] }) {
  const normalizedContacts = contacts.map((contact) => normalizeContact(contact));
  return (
    <BulletedList>
      {normalizedContacts.map(({ name, orcid }) => (
        <BulletedListItem key={name}>
          {name}
          &nbsp;
          {isValidOrcidId(orcid) && <OutboundIconLink href={`https://orcid.org/${orcid}`}>{orcid}</OutboundIconLink>}
        </BulletedListItem>
      ))}
    </BulletedList>
  );
}

export default CorrespondingAuthorsList;
