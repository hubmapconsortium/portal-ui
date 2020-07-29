export function field(id, name, translations) {
  const def = {
    id,
    name,
  };
  if (translations) {
    def.translations = translations;
  }
  return def;
}

export function filter(id, name, translations) {
  const def = {
    type: 'RefinementListFilter',
    props: {
      id,
      title: name,
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
    },
  };
  if (translations) {
    def.props.translations = translations;
  }
  return def;
}

export function rangeFilter(id, name, min, max) {
  return {
    type: 'RangeFilter',
    props: {
      id,
      title: name,
      field: id,
      min,
      max,
      showHistogram: true,
    },
  };
}

// eslint-disable-next-line no-shadow
export function checkboxFilter(id, name, filter) {
  return {
    type: 'CheckboxFilter',
    props: {
      id,
      title: name,
      label: 'True',
      filter,
    },
  };
}
