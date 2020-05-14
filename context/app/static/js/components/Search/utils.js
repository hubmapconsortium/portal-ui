export function filter(id, name) {
  return {
    type: 'RefinementListFilter',
    props: {
      id: id,
      title: name,
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
    },
  };
}
