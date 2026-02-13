import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';

export type ThemeColorKey = 'info' | 'warning' | 'success' | 'error';

export interface SlideImage {
  src: string;
  alt: string;
  /** Delay factor (0-1) for staggered animation. 0 = immediate, higher = later */
  delay?: number;
}

export interface CTAButton {
  label: string;
  href: string;
  variant: 'contained' | 'outlined';
  trackingLabel: string;
}

export interface SlideConfig {
  id: string;
  theme: ThemeColorKey;
  icon: MUIIcon;
  title: string;
  description: string;
  bulletPoints?: string[];
  ctaButtons: CTAButton[];
  images: SlideImage[];
  layout: 'text-left' | 'text-right';
}

export interface ViewConfig {
  id: string;
  theme: ThemeColorKey;
  icon: MUIIcon;
  title: string;
  description: string;
  ctaButton: CTAButton;
  images: SlideImage[];
}

export interface MultiViewSlideConfig {
  id: string;
  sectionTitle: string;
  icon: MUIIcon;
  sectionDescription: string;
  views: ViewConfig[];
}
