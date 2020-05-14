export default {
  filters: [
    {
      type: 'RefinementListFilter',
      props: {
        id: 'created_by_user_displayname',
        title: 'Creator',
        field: 'created_by_user_displayname.keyword',
        operator: 'OR',
        size: 10,
      },
    },
    {
      type: 'RefinementListFilter',
      props: {
        id: 'group_name',
        title: 'Group',
        field: 'group_name.keyword',
        operator: 'OR',
        size: 10,
      },
    },
  ],
  fields: ['description', 'status', 'entity_type'],
};
