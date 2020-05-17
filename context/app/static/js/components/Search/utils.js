import fromEntries from 'fromentries';
import searchDefinitions from '../../../../../search-schema/data/definitions.yaml';

export function field(id, name) {
  return {
    id: id,
    name: name,
  };
}

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

export function organFilter(id) {
  const organTranslations = fromEntries(
    Object.entries(
      searchDefinitions.enums.organ_types
    ).map((entry) => [entry[0], entry[1].description])
  )

  return {
    type: 'RefinementListFilter',
    props: {
      id: id,
      title: 'Organ',
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
      translations: organTranslations,
    }
  };
}

export function specimenTypeFilter(id){
  const specimenTypeTranslations = fromEntries(
    Object.entries(
      searchDefinitions.enums.tissue_sample_types
    ).map((entry) => [entry[0], entry[1].description])
  )

  return {
    type: 'RefinementListFilter',
    props: {
      id: id,
      title: 'Specimen Type',
      field: `${id}.keyword`,
      operator: 'OR',
      size: 5,
      translations: specimenTypeTranslations,
    }
  };
}
