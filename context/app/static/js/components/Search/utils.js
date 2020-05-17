import fromEntries from 'fromentries';
import searchDefinitions from '../../../../../search-schema/data/definitions.yaml';

const organTranslations = fromEntries(
  Object.entries(
    searchDefinitions.enums.organ_types
  ).map((entry) => [entry[0], entry[1].description])
);

const specimenTypeTranslations = fromEntries(
  Object.entries(
    searchDefinitions.enums.tissue_sample_types
  ).map((entry) => [entry[0], entry[1].description])
);


export function field(id, name) {
  return {
    id: id,
    name: name,
  };
}

export function organField(id, name) {
  return {
    id: id,
    name: name,
    translations: organTranslations
  };
}

export function specimenTypeField(id, name) {
  return {
    id: id,
    name: name,
    translations: specimenTypeTranslations
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
