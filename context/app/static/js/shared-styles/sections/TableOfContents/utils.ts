import { capitalizeAndReplaceDashes } from 'js/helpers/functions';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { TableOfContentsItem } from './TableOfContents';

function getSectionFromString(s: string): TableOfContentsItem {
  return { text: capitalizeAndReplaceDashes(s), hash: s, icon: sectionIconMap?.[s] };
}

function getSections(sectionOrder: string[]) {
  // Array order reflects order of table of contents.
  return sectionOrder.map((s) => getSectionFromString(s));
}

export { getSections, getSectionFromString };
