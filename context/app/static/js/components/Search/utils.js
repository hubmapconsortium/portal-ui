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
      // We are using default mappings in Elasticsearch.
      // As a consequence, if we want to sort a text field,
      // we need to use the ".keyword" mapping.
      // No such suffix is necessary (or allowed) for numeric fields.
      // https://www.elastic.co/blog/strings-are-dead-long-live-strings
      //
      // So: If there are more numeric fields, remember to update the regex!
      const isNumeric = f.id.match(/\.(age|bmi|size)$/);
      const base = {
        defaultOption: false,
        label: f.name,
        field: `${f.id}${isNumeric ? '' : '.keyword'}`,
      };
      return [
        { ...base, order: 'desc', defaultOption: f.id === 'mapped_last_modified_timestamp' },
        { ...base, order: 'asc' },
      ];
    })
    .flat();
}
