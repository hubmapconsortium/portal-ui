import SvgIcon from '@mui/material/SvgIcon';

export interface TableOfContentsItem {
  text: string;
  hash: string;
  icon?: typeof SvgIcon;
  items?: TableOfContentsItem[];
}

export interface TableOfContentsItemWithNode extends TableOfContentsItem {
  node: ReturnType<typeof document.getElementById>;
}

export type TableOfContentsItems<I = TableOfContentsItem> = I[];
