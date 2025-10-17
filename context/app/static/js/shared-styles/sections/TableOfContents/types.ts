import SvgIcon from '@mui/material/SvgIcon';
import { ExternalIcons } from 'js/shared-styles/icons/externalImageIcons';
import { MutableRefObject } from 'react';

export interface TableOfContentsItem {
  text: string;
  hash: string;
  icon?: typeof SvgIcon;
  externalIcon?: ExternalIcons;
  items?: TableOfContentsItem[];
  isRoute?: boolean; // Indicates if this should navigate to a route instead of scrolling to a section
  initiallyClosed?: boolean;
}

export interface TableOfContentsItemWithNode extends TableOfContentsItem {
  node: ReturnType<typeof document.getElementById>;
}

export type TableOfContentsItems<I = TableOfContentsItem> = I[];

export type TableOfContentsNodesRef = MutableRefObject<TableOfContentsItems<TableOfContentsItemWithNode>>;
