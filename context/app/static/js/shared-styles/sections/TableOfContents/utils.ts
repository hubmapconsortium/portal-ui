import { capitalizeAndReplaceDashes } from 'js/helpers/functions';

type Section = [string, { text: string; hash: string }];

function getSectionFromString(s: string): Section {
  return [s, { text: capitalizeAndReplaceDashes(s), hash: s }];
}

function getSections(sectionOrder: string[]) {
  // Array order reflects order of table of contents.
  return sectionOrder.map((s) => getSectionFromString(s));
}

export { getSections };
