import React from 'react';
import PortalSearch from '@hubmap/portal-search';
import Container from '@material-ui/core/Container';
import { readCookie } from '../../helpers/functions';

const searchProps = {
  // Elasticsearch instance to hit with queries:
  apiUrl: process.env.ELASTICSEARCH_ENDPOINT,
  // The default behavior is to add a "_search" path.
  // We don't want that.
  searchUrlPath: '',
  // Pass Globus token:
  httpHeaders: {
    Authorization: `Bearer ${readCookie('nexus_token')}`,
  },
  // Fields to search, and whether they have extra weight:
  prefixQueryFields: ['description'],
  // Prefix for details links:
  detailsUrlPrefix: '/browse/dataset/', // TODO: Make this different for different datasets.
  // Search results field which will be appended to detailsUrlPrefix:
  idField: 'uuid',
  // Search results fields to display in table:
  resultFields: ['hubmap_identifier', 'display_doi', 'description', 'entitytype'],
  // Default hitsPerPage is 10:
  hitsPerPage: 20,
  // Sidebar facet configuration;
  // "type" should be one of the filters described here:
  // http://docs.searchkit.co/stable/components/navigation/
  filters: [
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
    // {
    //   type: 'RefinementListFilter',
    //   props: {
    //     id: 'organ',
    //     title: 'Organ',
    //     field: 'organ.keyword',
    //     operator: 'OR',
    //     size: 5,
    //     translations: {
    //       // Copied from:
    //       // https://github.com/hubmapconsortium/ingest-ui/blob/master/src/ingest-ui/src/constants.jsx
    //       BL: "Bladder",
    //       BR: "Brain",
    //       LB: "Bronchus (Left)",
    //       RB: "Bronchus (Right)",
    //       HT: "Heart",
    //       LK: "Kidney (Left)",
    //       RK: "Kidney (Right)",
    //       LI: "Large Intestine",
    //       LV: "Liver",
    //       LL: "Lung (Left)",
    //       RL: "Lung (Right)",
    //       LY01: "Lymph Node 01",
    //       LY02: "Lymph Node 02",
    //       LY03: "Lymph Node 03",
    //       LY04: "Lymph Node 04",
    //       LY05: "Lymph Node 05",
    //       LY06: "Lymph Node 06",
    //       LY07: "Lymph Node 07",
    //       LY08: "Lymph Node 08",
    //       LY09: "Lymph Node 09",
    //       LY10: "Lymph Node 10",
    //       LY11: "Lymph Node 11",
    //       LY12: "Lymph Node 12",
    //       LY13: "Lymph Node 13",
    //       LY14: "Lymph Node 14",
    //       LY15: "Lymph Node 15",
    //       LY16: "Lymph Node 16",
    //       LY17: "Lymph Node 17",
    //       LY18: "Lymph Node 18",
    //       LY19: "Lymph Node 19",
    //       LY20: "Lymph Node 20",
    //       SI: "Small Intestine",
    //       SP: "Spleen",
    //       TH: "Thymus",
    //       TR: "Trachea",
    //       UR: "Ureter",
    //       OT: "Other"
    //     }
    //   },
    // }
  ],
};

function Search() {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Container maxWidth="lg">
      <PortalSearch.Search {...searchProps} />
    </Container>
  );
/* eslint-enable react/jsx-props-no-spreading */
}

export default Search;
