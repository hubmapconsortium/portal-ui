import { capitalizeString } from 'js/helpers/functions';

function getSectionFromString(s) {
  return [s, { text: capitalizeString(s), hash: s }];
}

function getSections(sectionOrder) {
  // Array order reflects order of table of contents.
  return sectionOrder.map((s) => getSectionFromString(s));
}

export { getSections };
