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

export function resultFieldsToSortOptions(fields) {
  return fields
    .map((f) => {
      const base = {
        defaultOption: false,
        label: f.name,
        field: `${f.id}.keyword`,
      };
      return [
        { ...base, order: 'desc', defaultOption: f.id === 'mapped_last_modified_timestamp' },
        { ...base, order: 'asc' },
      ];
    })
    .flat();
}
