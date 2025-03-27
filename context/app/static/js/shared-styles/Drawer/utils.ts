import { isValidElement } from 'react';
import { DrawerItemProps, DrawerSection, DrawerSectionProps } from './types';

export function sectionIsProps(section: unknown): section is DrawerSectionProps {
  if (isValidElement(section)) return false;
  return true;
}

export function itemIsProps(item: unknown): item is DrawerItemProps {
  if (!item || isValidElement(item)) return false;
  return true;
}

export function getKeyFromReactNode(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (isValidElement(node) && typeof node.key === 'string') return node.key;
  return 'no-key';
}

export function getKeyFromSection(section: DrawerSection): string {
  if (sectionIsProps(section)) return section.title;
  return getKeyFromReactNode(section);
}
