import { capitalizeAndReplaceDashes } from 'js/helpers/functions';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { TableOfContentsItem } from './TableOfContents';

function getSectionFromString(s: string): TableOfContentsItem {
  return { text: capitalizeAndReplaceDashes(s), hash: s, icon: sectionIconMap?.[s] };
}

export type SectionOrder = Record<string, boolean | TableOfContentsItem>;

function getSections(sectionOrder: SectionOrder) {
  const sectionsToDisplay = Object.entries(sectionOrder).filter(([_k, v]) => Boolean(v) === true);
  // Array order reflects order of table of contents.
  return sectionsToDisplay.map(([s, v]) => {
    if (typeof v === 'object' && v !== null) {
      return v;
    }
    return getSectionFromString(s);
  });
}

export { getSections, getSectionFromString };
