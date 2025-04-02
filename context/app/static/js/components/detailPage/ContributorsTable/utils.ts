// Legacy contributors use TRUE / FALSE
type LegacyBoolean = 'TRUE' | 'FALSE';
// CEDAR contributors use Yes / No
type CEDARBoolean = 'Yes' | 'No';

interface ContributorBase {
  affiliation: string;
  first_name: string;
  last_name: string;
  middle_name_or_initial: string;
}

export interface V0Contributor extends ContributorBase {
  name: string;
  orcid_id: string;
  version: '0';
}

export interface LegacyContributor extends ContributorBase {
  is_contact: LegacyBoolean;
  name: string;
  orcid_id: string;
  version: '1';
}

type V2SchemaId = '94dae6f8-0756-4ab0-a47b-138e446a9501';
// Add future CEDAR schema IDs here as needed
type CEDARSchemaID = V2SchemaId;

export interface CEDARContributor extends ContributorBase {
  display_name: string;
  email: string;
  orcid: string;
  is_contact: CEDARBoolean;
  is_operator: CEDARBoolean;
  is_principal_investigator: CEDARBoolean;
  metadata_schema_id: CEDARSchemaID;
}

export type ContributorAPIResponse = V0Contributor | LegacyContributor | CEDARContributor;

export interface LegacyContact extends LegacyContributor {
  is_contact: 'TRUE';
}
export interface CEDARContact extends CEDARContributor {
  is_contact: 'Yes';
}

export type ContactAPIResponse = V0Contributor | LegacyContact | CEDARContact;

export interface Contributor {
  affiliation: string;
  firstName: string;
  lastName: string;
  middleNameOrInitial: string;
  name: string;
  email: string;
  isContact: boolean;
  isOperator: boolean;
  isPrincipalInvestigator: boolean;
  orcid: string;
}

export interface Contact extends Contributor {
  isContact: true;
}

const humanBooleanToBoolean = (humanBoolean: LegacyBoolean | CEDARBoolean): boolean =>
  humanBoolean === 'TRUE' || humanBoolean === 'Yes';

export const normalizeContributor = (contributor: ContributorAPIResponse): Contributor => ({
  affiliation: contributor.affiliation,
  name: 'name' in contributor ? contributor.name : contributor.display_name,
  email: 'email' in contributor ? contributor.email : 'N/A',
  firstName: contributor.first_name,
  isContact: 'is_contact' in contributor ? humanBooleanToBoolean(contributor.is_contact) : false,
  isOperator: 'is_operator' in contributor ? humanBooleanToBoolean(contributor.is_operator) : false,
  isPrincipalInvestigator:
    'is_principal_investigator' in contributor ? humanBooleanToBoolean(contributor.is_principal_investigator) : false,
  lastName: contributor.last_name,
  middleNameOrInitial: contributor.middle_name_or_initial,
  orcid: 'orcid' in contributor ? contributor.orcid : contributor.orcid_id,
});

export const normalizeContact = (contact: ContactAPIResponse): Contact => ({
  ...normalizeContributor(contact),
  isContact: true,
});

/**
 * Given a contributor, determine if they are a contact. Necessary to account
 * for different versions of contributors schemas - some versions include the
 * isContact field in contributors, and some have a separate contacts array that
 * must be checked.
 * @author Austen Money
 * @param contributor a contributor to be checked.
 * @param contacts an array of contacts to search for the contributor.
 * @returns true if the contributor is a contact, false otherwise.
 */
export const contributorIsContact = (contributor: Contributor, contacts: Contact[]): boolean => {
  switch (true) {
    case contributor.isContact:
      return true;
    case contacts.find((contact) => contact.orcid === contributor.orcid) !== undefined:
      return true;
    default:
      return false;
  }
};
