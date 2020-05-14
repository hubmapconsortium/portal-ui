export default {
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
        id: 'donor_group',
        title: 'Group',
        field: 'donor.group_name.keyword',
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
  ],
  fields: ['description', 'status', 'entity_type'],
};
