import { capitalizeAndReplaceDashes } from 'js/helpers/functions';
import { sectionIconMap, sectionImageIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { TableOfContentsItem, TableOfContentsItemWithNode, TableOfContentsItems } from './types';

function formatSectionHash(hash: string) {
  const hashWithoutDots = hash.replace(/\s/g, '').toLowerCase();
  return encodeURIComponent(hashWithoutDots);
}

function getSectionFromString(s: string, hash: string = formatSectionHash(s)): TableOfContentsItem {
  return {
    text: capitalizeAndReplaceDashes(s),
    hash,
    icon: sectionIconMap?.[s],
    externalIcon: sectionImageIconMap?.[s],
  };
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

const flattenSections = (sections: TableOfContentsItem[]): TableOfContentsItem[] => {
  const flattenedSections: TableOfContentsItem[] = [];

  const flatten = (nestedItems: TableOfContentsItem[]) => {
    nestedItems.forEach((item) => {
      flattenedSections.push({ ...item, items: undefined });
      if (item.items) {
        flatten(item.items);
      }
    });
  };

  flatten(sections);
  return flattenedSections;
};

function getItemsClient(items: TableOfContentsItems): TableOfContentsItems<TableOfContentsItemWithNode> {
  const flattenedItems = flattenSections(items);

  return flattenedItems.map((item) => ({
    text: item.text,
    hash: item.hash,
    node: document.getElementById(item.hash),
    icon: item.icon,
    externalIcon: item.externalIcon,
    ...(item?.items && { items: getItemsClient(item.items) }),
  }));
}

export { getSections, flattenSections, getSectionFromString, getItemsClient, formatSectionHash };
