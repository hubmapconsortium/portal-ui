import { ListSubheaderProps } from '@mui/material/ListSubheader';
import React from 'react';

export interface DrawerItemProps {
  href: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export interface DrawerSectionProps {
  title: string;
  hideTitle?: boolean;
  titleProps?: Partial<ListSubheaderProps>;
  items: (DrawerItemProps | React.ReactNode)[];
}

export type DrawerSection = DrawerSectionProps | React.ReactNode;

export interface NavigationDrawerProps {
  title: string;
  direction: 'left' | 'right';
  sections: DrawerSection[];
  onClose: () => void;
  open: boolean;
}
