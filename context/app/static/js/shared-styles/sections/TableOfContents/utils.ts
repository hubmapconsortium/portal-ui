import SvgIcon from '@mui/material/SvgIcon';
import { capitalizeAndReplaceDashes } from 'js/helpers/functions';
import { sectionIconMap, sectionImageIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { TableOfContentsItem, TableOfContentsItemWithNode, TableOfContentsItems } from './types';

function formatSectionHash(hash: string) {
  const hashWithoutDots = hash.replace(/\s/g, '').toLowerCase();
  return encodeURIComponent(hashWithoutDots);
}

function getSectionFromString(
  s: string,
  hash: string = formatSectionHash(s),
  iconOverride?: typeof SvgIcon,
): TableOfContentsItem {
  return {
    text: capitalizeAndReplaceDashes(s),
    hash,
    icon: iconOverride ?? sectionIconMap?.[s],
    externalIcon: iconOverride ? undefined : sectionImageIconMap?.[s],
  };
}

export type SectionOrder = Record<string, boolean | TableOfContentsItem>;

// Recursively replaces a section's icon (and those of any nested items, e.g. the processed datasets
// listed under "Processed Data") with the override component.
function applyIconOverride(item: TableOfContentsItem, iconOverride: typeof SvgIcon): TableOfContentsItem {
  return {
    ...item,
    icon: iconOverride,
    externalIcon: undefined,
    ...(item.items && { items: item.items.map((child) => applyIconOverride(child, iconOverride)) }),
  };
}

/**
 * @param iconOverride When provided, every section's icon — including nested items such as the
 *   processed datasets under "Processed Data" — is replaced with this component (used to mark all
 *   sections of a retracted dataset with the retracted status icon).
 */
function getSections(sectionOrder: SectionOrder, iconOverride?: typeof SvgIcon) {
  const sectionsToDisplay = Object.entries(sectionOrder).filter(([_k, v]) => Boolean(v));
  // Array order reflects order of table of contents.
  return sectionsToDisplay.map(([s, v]) => {
    if (typeof v === 'object' && v !== null) {
      return iconOverride ? applyIconOverride(v, iconOverride) : v;
    }
    return getSectionFromString(s, undefined, iconOverride);
  });
}

const flattenSections = (sections: TableOfContentsItem[]): TableOfContentsItem[] => {
  return sections.flatMap((item) => (item.items ? [item, ...flattenSections(item.items)] : [item]));
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
