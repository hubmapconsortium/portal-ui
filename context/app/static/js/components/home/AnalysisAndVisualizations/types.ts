import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';

export type ThemeColorKey = 'info' | 'warning' | 'success' | 'error';

export interface SlideImage {
  src: string;
  alt: string;
  /** Delay factor (0-1) for staggered animation. 0 = immediate, higher = later */
  delay?: number;
  /**
   * When set, the slot renders an autoplaying, looping, muted webm/mp4 video instead
   * of an <img>. `src` (or `poster`) is used as the poster frame.
   */
  videoSrc?: string;
  /** Poster image shown before the video plays. Falls back to `src` if omitted. */
  poster?: string;
}

/** A single Vitessce screenshot in the single-cell view carousel. */
export interface CarouselItem {
  src: string;
  alt: string;
  /** Link to the original Vitessce visualization. */
  href: string;
  /** Assay name, e.g. "CODEX/Phenocycler". */
  assay: string;
  /** Analyte, e.g. "Proteins". */
  analyte: string;
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
  /** One paragraph, or several rendered as separate paragraphs. */
  description: string | string[];
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
  /**
   * When present, this view's media area renders a carousel of Vitessce screenshots
   * (used by the single-cell view) instead of the `images` media.
   */
  carousel?: CarouselItem[];
  /** Optional CTA button overlaid on the bottom-right of the view's image, like the carousel's. */
  imageCta?: {
    label: string;
    href: string;
    trackingLabel: string;
  };
}

export interface MultiViewSlideConfig {
  id: string;
  sectionTitle: string;
  icon: MUIIcon;
  sectionDescription: string;
  views: ViewConfig[];
}
