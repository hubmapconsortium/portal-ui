import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { ThemeColorKey } from '../types';

// Map theme color keys to their accent90 palette keys
export const accentColorMap: Record<ThemeColorKey, string> = {
  info: 'info90',
  warning: 'warning90',
  success: 'success90',
  error: 'primary90', // error uses primary90 in the theme
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
  },
}));

/**
 * Inner content that sticks to the viewport while scrolling through the runway.
 */
export const StickySlideContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4, 2),

  [theme.breakpoints.up('md')]: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface GradientBackgroundProps {
  $theme: ThemeColorKey;
}

export const GradientBackground = styled('div')<GradientBackgroundProps>(({ theme, $theme }) => {
  const accentKey = accentColorMap[$theme] as keyof typeof theme.palette.accent;
  const accentColor = theme.palette.accent[accentKey];

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    background: `linear-gradient(135deg, ${accentColor} 0%, ${theme.palette.common.white} 100%)`,
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
 * Text column that sticks within the slide viewport on desktop,
 * staying centered vertically while the user scrolls.
 */
export const TextContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  [theme.breakpoints.up('md')]: {
    position: 'sticky',
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

interface ImageGroupProps {
  $layout: 'text-left' | 'text-right';
}

export const ImageGroup = styled(Box)<ImageGroupProps>(({ theme, $layout }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  position: 'relative',

  // Ensure images column comes first on desktop when text-right layout
  [theme.breakpoints.up('md')]: {
    order: $layout === 'text-right' ? -1 : 0,
  },
}));
