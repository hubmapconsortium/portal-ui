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
