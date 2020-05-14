import { filter } from './utils';

export default {
  filters: [
    {
      type: 'RefinementListFilter',
      props: {
        id: 'origin_sample_organ',
        title: 'Organ',
        field: 'origin_sample.organ.keyword',
        operator: 'OR',
        size: 5,
      },
    },
    {
      type: 'RefinementListFilter',
      props: {
        id: 'specimen_type',
        title: 'Specimen Type',
        field: 'specimen_type.keyword',
        operator: 'OR',
        size: 5,
      },
    },
    {
      type: 'RefinementListFilter',
      props: {
        id: 'donor_group_name',
        title: 'Group',
        field: 'donor.group_name.keyword',
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
  ],
  fields: ['description', 'status', 'entity_type'],
};
