import React from 'react';

import CitationComponent from './Citation';
import { ContributorAPIResponse } from '../ContributorsTable/utils';

export default {
  title: 'EntityDetail/Citation',
  component: CitationComponent,
};

interface CitationArgs {
  contributors: ContributorAPIResponse[];
  citationTitle: string;
  created_timestamp: number;
  doi: string;
  doi_url: string;
}

const contributors: ContributorAPIResponse[] = [
  {
    last_name: 'Aanders',
    first_name: 'Aanne',
    affiliation: 'Sesame Street',
    display_name: 'Aanne Aanders',
    email: 'abc123',
    is_contact: 'No',
    is_operator: 'No',
    is_principal_investigator: 'No',
    metadata_schema_id: '94dae6f8-0756-4ab0-a47b-138e446a9501',
    middle_name_or_initial: 'D',
    orcid: 'ORCID123',
  },
  {
    last_name: 'Banders',
    first_name: 'Banne',
    affiliation: 'Sesame Street',
    display_name: 'Banne Banders',
    email: 'abc123',
    is_contact: 'No',
    is_operator: 'No',
    is_principal_investigator: 'No',
    metadata_schema_id: '94dae6f8-0756-4ab0-a47b-138e446a9501',
    middle_name_or_initial: 'D',
    orcid: 'ORCID123',
  },
  {
    last_name: 'Canders',
    first_name: 'Canne',
    affiliation: 'Sesame Street',
    display_name: 'Canne Canders',
    email: 'abc123',
    is_contact: 'No',
    is_operator: 'No',
    is_principal_investigator: 'No',
    metadata_schema_id: '94dae6f8-0756-4ab0-a47b-138e446a9501',
    middle_name_or_initial: 'D',
    orcid: 'ORCID123',
  },
];
export function Citation(args: CitationArgs) {
  return <CitationComponent {...args} />;
}
Citation.args = {
  contributors,
  citationTitle: 'Something Science-y',
  created_timestamp: 1520153805000,
  doi: 'fakeDoi',
  doi_url: 'https://www.doi.org/',
};
