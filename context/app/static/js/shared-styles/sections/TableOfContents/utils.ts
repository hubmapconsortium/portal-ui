import { capitalizeAndReplaceDashes } from 'js/helpers/functions';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { TableOfContentsItem, TableOfContentsItemWithNode, TableOfContentsItems } from './types';

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

function getItemsClient(items: TableOfContentsItems): TableOfContentsItems<TableOfContentsItemWithNode> {
  return items.map((item) => ({
    text: item.text,
    hash: item.hash,
    node: document.getElementById(item.hash),
    icon: item.icon,
    ...(item?.items && { items: getItemsClient(item.items) }),
  }));
}

export { getSections, getSectionFromString, getItemsClient };
