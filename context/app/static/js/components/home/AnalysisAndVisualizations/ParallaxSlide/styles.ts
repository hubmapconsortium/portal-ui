import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { ThemeColorKey } from '../types';

// Gradient accent color per theme key. The gradient runs from this color to white.
export const accentColorMap: Record<ThemeColorKey, string> = {
  info: '#bdcfe9', // Cloud Workspaces, Metadata Exploration
  warning: '#f1cac0', // Biomarkers & Cell Types, Integrated Maps
  success: '#d1dac1', // Single-Cell and Spatial Data Visualizations
  error: '#f4c0db', // Cell Populations Viewer
};

/**
 * Outer wrapper that creates scroll runway for each slide.
 * On desktop, this is taller than 100vh so the sticky inner content
 * has scroll space for animations before the next slide covers it.
 */
interface ScrollRunwayProps {
  $zIndex: number;
}

export const ScrollRunway = styled(Box)<ScrollRunwayProps>(({ theme, $zIndex }) => ({
  position: 'relative',

  [theme.breakpoints.up('md')]: {
    // Extra height creates scroll space for image animations
    height: '180vh',
    zIndex: $zIndex,
    // Every slide after the first is pulled up by one viewport so it overlaps the
    // previous slide's runway and — with the higher zIndex + opaque gradient — slides
    // up and covers it, instead of the two just scrolling past each other.
    marginTop: $zIndex > 1 ? '-100vh' : 0,
  },
}));

/**
 * Inner content that sticks to the viewport while scrolling through the runway.
 */
export const StickySlideContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4, 2),
  // Own stacking context so the z-index:-1 gradient stays behind THIS slide's content
  // rather than the page. On desktop `position: sticky` already provides one, but on
  // mobile there's no sticky, so without this the gradient disappears behind the page.
  isolation: 'isolate',

  [theme.breakpoints.up('md')]: {
    position: 'sticky',
    // Sit below the sticky header (banner + app bar) and fill the rest of the viewport,
    // but grow taller if the content needs it (min-height, not a fixed height) so nothing
    // is clipped on shorter viewports.
    top: headerHeight,
    minHeight: `calc(100vh - ${headerHeight}px)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Promote to a compositor layer so scrolling the stacked sticky slides composites
    // instead of repainting the full-viewport content each frame.
    willChange: 'transform',
  },
}));

interface GradientBackgroundProps {
  $theme: ThemeColorKey;
}

export const GradientBackground = styled('div')<GradientBackgroundProps>(({ theme, $theme }) => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: `linear-gradient(135deg, ${accentColorMap[$theme]} 0%, ${theme.palette.common.white} 100%)`,
  };
});

interface SlideGridProps {
  $layout: 'text-left' | 'text-right';
}

export const SlideGrid = styled(Box)<SlideGridProps>(({ theme, $layout }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  padding: theme.spacing(0, 2),

  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: $layout === 'text-left' ? '5fr 4fr' : '4fr 5fr',
    gap: theme.spacing(6),
    alignItems: 'start',
  },
}));

/**
 * Text column. Top-aligned with the media column (via SlideGrid's `alignItems: start`)
 * so the video lines up with the full text block — title and icon included. The whole
 * slide is vertically centered by StickySlideContent, so the text needs no separate
 * centering of its own.
 */
export const TextContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

interface ImageGroupProps {
  $layout: 'text-left' | 'text-right';
}

export const ImageGroup = styled(Box)<ImageGroupProps>(({ theme, $layout }) => ({
  display: 'grid',
  // Single full-width media (video) filling this column — not a grid of thumbnails.
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  position: 'relative',

  // Ensure images column comes first on desktop when text-right layout
  [theme.breakpoints.up('md')]: {
    order: $layout === 'text-right' ? -1 : 0,
  },
}));
