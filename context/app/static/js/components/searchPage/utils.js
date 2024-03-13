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

export function hierarchicalFilter({ fields, name, filterProps = {}, itemProps = {} }) {
  const ids = [fields.parent.id, fields.child.id];
  const def = {
    type: 'AccordionHierarchicalMenuFilter',
    props: {
      fields: ids,
      title: name,
      id: ids.join('-'),
      size: 10000,
      ...filterProps,
    },
    itemProps,
  };
  return def;
}

export function legacyHierarchicalFilter(ids, name) {
  const def = {
    type: 'LegacyHierarchicalMenuFilter',
    props: {
      fields: ids.map((id) => `${id}.keyword`),
      title: name,
      id: ids.join('-'),
      size: 10000,
    },
  };
  return def;
}

// `rest` is an object with keys corresponding to additional props of the
// Searchkit RefinementList
// https://github.com/searchkit/searchkit/blob/6f3786657c8afa6990a41acb9f2371c28b2e0986/packages/searchkit-docs/docs/components/navigation/refinement-list.md
export function listFilter(id, name, filterProps = {}, itemProps = {}) {
  const def = {
    type: 'AccordionListFilter',
    props: {
      id,
      title: name,
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
      ...filterProps,
    },
    itemProps,
  };
  return def;
}

export function boolListFilter(id, name, filterProps = {}, itemProps = {}) {
  const def = listFilter(id, name, filterProps, itemProps);
  def.props.field = id;
  return def;
}

export function rangeFilter(id, name, min, max) {
  return {
    type: 'AccordionRangeFilter',
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

export function checkboxFilter(id, name, filter) {
  return {
    type: 'AccordionCheckboxFilter',
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
      const isNumeric = f.id.match(/(_value|\.size)$/);
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

export function getSortPairs(sortItems) {
  const pairs = [];
  for (let i = 0; i < sortItems.length; i += 2) {
    const pair = sortItems.slice(i, i + 2);
    pairs.push(pair);
    if (pair[0].label !== pair[1].label || pair[0].field !== pair[1].field) {
      console.warn('Expected pair.label and .field to match', pair);
    }
  }
  return pairs;
}
