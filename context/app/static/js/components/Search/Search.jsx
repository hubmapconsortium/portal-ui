import React from 'react';
import Container from '@material-ui/core/Container';
import PortalSearch from '../PortalSearch/PortalSearch';
import { readCookie } from '../../helpers/functions';
import 'searchkit/theming/theme.scss';
import './Search.css';

const commonFilters = [
  {
    type: 'RefinementListFilter',
    props: {
      id: 'ancestor_id',
      title: 'Ancestor UUID',
      field: 'ancestor_ids.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'created_by_user_displayname',
      title: 'Creator',
      field: 'created_by_user_displayname.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'contains_human_genetic_sequences',
      title: 'Contains genetic sequences',
      field: 'contains_human_genetic_sequences.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'data_types', // Not working?
      title: 'Data type',
      field: 'data_types.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'donor_created_by',
      title: 'Donor created by',
      field: 'donor.created_by_user_displayname.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'donor_group',
      title: 'Donor group',
      field: 'donor.group_name.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'entity_type',
      title: 'Type',
      field: 'entity_type.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'origin_sample_created_by',
      title: 'Organ created by',
      field: 'origin_sample.created_by_user_displayname.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'source_sample_specimen_type',
      title: 'Specimen type',
      field: 'source_sample.specimen_type.keyword',
      operator: 'OR',
      size: 5,
    },
  },
  {
    type: 'RefinementListFilter',
    props: {
      id: 'status',
      title: 'Status',
      field: 'status.keyword',
      operator: 'OR',
      size: 5,
    },
  },
];

const filtersByType = {
  '': commonFilters,
  donor: commonFilters,
  sample: commonFilters,
  dataset: commonFilters,
};

const resultFieldsByType = {
  '': ['description', 'status', 'entity_type'],
  donor: ['description', 'status', 'entity_type'],
  sample: ['description', 'status', 'entity_type'],
  dataset: ['description', 'status', 'entity_type'],
};
const type = (new URL(document.location).searchParams.get('entity_type[0]') || '').toLowerCase();

const searchProps = {
  // The default behavior is to add a "_search" path.
  // We don't want that.
  searchUrlPath: '',
  // Pass Globus token:
  httpHeaders: {
    Authorization: `Bearer ${readCookie('nexus_token')}`,
  },
  // Prefix for details links:
  detailsUrlPrefix: `/browse/${type || 'dataset'}/`,
  // Search results field which will be appended to detailsUrlPrefix:
  idField: 'uuid',
  // Search results fields to display in table:
  resultFields: resultFieldsByType[type],
  // Default hitsPerPage is 10:
  hitsPerPage: 20,
  // Sidebar facet configuration;
  // "type" should be one of the filters described here:
  // http://docs.searchkit.co/stable/components/navigation/
  filters: filtersByType[type],
  hiddenFilterIds: ['entity_type'],
};

function Search(props) {
  const { esEndpoint } = props;
  const allProps = Object.assign(searchProps, { apiUrl: esEndpoint });
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Container maxWidth="lg">
      <PortalSearch {...allProps} />
    </Container>
  );
/* eslint-enable react/jsx-props-no-spreading */
}

export default Search;
