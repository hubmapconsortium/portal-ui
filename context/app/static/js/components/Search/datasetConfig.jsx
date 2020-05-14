export default {
  filters: [
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
  ],
  fields: ['description', 'status', 'entity_type'],
};
