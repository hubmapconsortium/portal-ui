// Legacy contributors use TRUE / FALSE
type LegacyBoolean = 'TRUE' | 'FALSE';
// CEDAR contributors use Yes / No
type CEDARBoolean = 'Yes' | 'No';

export interface LegacyContributor {
  affiliation: string;
  first_name: string;
  is_contact: LegacyBoolean;
  last_name: string;
  middle_name_or_initial: string;
  name: string;
  orcid_id: string;
  version: '1';
}

type V2SchemaId = '94dae6f8-0756-4ab0-a47b-138e446a9501';
// Add future CEDAR schema IDs here as needed
type CEDARSchemaID = V2SchemaId;

export interface CEDARContributor {
  affiliation: string;
  display_name: string;
  email: string;
  first_name: string;
  is_contact: CEDARBoolean;
  is_operator: CEDARBoolean;
  is_principal_investigator: CEDARBoolean;
  last_name: string;
  metadata_schema_id: CEDARSchemaID;
  middle_name_or_initial: string;
  orcid: string;
}

export type ContributorAPIResponse = LegacyContributor | CEDARContributor;
export type ContactAPIResponse = ContributorAPIResponse & { is_contact: 'Yes' | 'TRUE' };

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

const humanBooleanToBoolean = (humanBoolean: LegacyBoolean | CEDARBoolean): boolean =>
  humanBoolean === 'TRUE' || humanBoolean === 'Yes';

const normalizeLegacyContributor = (contributor: LegacyContributor): Contributor => ({
  affiliation: contributor.affiliation,
  name: contributor.name,
  email: 'N/A',
  firstName: contributor.first_name,
  isContact: humanBooleanToBoolean(contributor.is_contact),
  isOperator: false,
  isPrincipalInvestigator: false,
  lastName: contributor.last_name,
  middleNameOrInitial: contributor.middle_name_or_initial,
  orcid: contributor.orcid_id,
});

const normalizeCEDARContributor = (contributor: CEDARContributor): Contributor => {
  // In the future, if more iterations are made on the contributor version, add handling based on the schema ID here.
  return {
    affiliation: contributor.affiliation,
    name: contributor.display_name,
    email: contributor.email,
    firstName: contributor.first_name,
    isContact: humanBooleanToBoolean(contributor.is_contact),
    isOperator: humanBooleanToBoolean(contributor.is_operator),
    isPrincipalInvestigator: humanBooleanToBoolean(contributor.is_principal_investigator),
    lastName: contributor.last_name,
    middleNameOrInitial: contributor.middle_name_or_initial,
    orcid: contributor.orcid,
  };
};

export const normalizeContributor = (contributor: ContributorAPIResponse): Contributor =>
  'metadata_schema_id' in contributor
    ? normalizeCEDARContributor(contributor)
    : normalizeLegacyContributor(contributor);

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
export const contributorIsContact = (contributor: Contributor, contacts: Contributor[]): boolean => {
  switch (true) {
    case contributor.isContact:
      return true;
    case contacts.find((contact) => contact.orcid === contributor.orcid) !== undefined:
      return true;
    default:
      return false;
  }
};

/**
 * Given an array of contributors, sort them by contact status and then alphabetically by name.
 *   Ex sorted array: PI Contact C, PI Contact D, Contact, Contributor A, Contributor B
 * @author Austen Money
 * @param contributors an array of contributors to be sorted.
 * @param contacts an array of contacts to be used for sorting.
 * @returns a sorted array.
 */
export const sortContributors = (contributors: Contributor[], contacts: Contributor[]): Contributor[] =>
  contributors.sort((a, b) => {
    const aIsContact = contributorIsContact(a, contacts);
    const bIsContact = contributorIsContact(b, contacts);

    const aIsPIContact = aIsContact && a.isPrincipalInvestigator;
    const bIsPIContact = bIsContact && b.isPrincipalInvestigator;

    if (aIsPIContact && !bIsPIContact) {
      return -1;
    }
    if (!aIsPIContact && bIsPIContact) {
      return 1;
    }
    if (aIsContact && !bIsContact) {
      return -1;
    }
    if (!aIsContact && bIsContact) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });
