export interface DrawerItemProps {
  href: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

export interface DrawerSectionProps {
  title: string;
  hideTitle?: boolean;
  items: DrawerItemProps[];
}

export type DrawerSection = DrawerSectionProps | React.ReactNode;

export interface NavigationDrawerProps {
  title: string;
  direction: 'left' | 'right';
  sections: DrawerSection[];
  onClose: () => void;
  open: boolean;
}
