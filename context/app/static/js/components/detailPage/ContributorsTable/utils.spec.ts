import { normalizeContributor, LegacyContributor, CEDARContributor, Contributor } from './utils';

const legacyContributor: LegacyContributor = {
  name: 'John B. Doe',
  affiliation: 'University of California, San Francisco',
  first_name: 'John',
  is_contact: 'TRUE',
  last_name: 'Doe',
  middle_name_or_initial: 'B.',
  orcid_id: '0000-0000-0000-0000',
  version: '1',
};

const cedarContributor: CEDARContributor = {
  affiliation: 'University of California, San Francisco',
  display_name: 'John B. Doe',
  email: 'N/A',
  first_name: 'John',
  is_contact: 'Yes',
  is_operator: 'No',
  is_principal_investigator: 'No',
  last_name: 'Doe',
  metadata_schema_id: '94dae6f8-0756-4ab0-a47b-138e446a9501',
  middle_name_or_initial: '',
  orcid: '',
};

const normalizedContributor: Contributor = {
  affiliation: 'University of California, San Francisco',
  displayName: 'John B. Doe',
  email: 'N/A',
  firstName: 'John',
  isContact: true,
  isOperator: false,
  isPrincipalInvestigator: false,
  lastName: 'Doe',
  middleNameOrInitial: 'B.',
  orcid: '0000-0000-0000-0000',
};

describe('ContributorsTable utils', () => {
  test('normalizeContributor should normalize a legacy contributor', () => {
    const normalized = normalizeContributor(legacyContributor);
    expect(normalized).toEqual(normalizedContributor);
  });
  test('normalizeContributor should normalize a CEDAR contributor', () => {
    const normalized = normalizeContributor(cedarContributor);
    expect(normalized).toEqual(normalizedContributor);
  });
});
