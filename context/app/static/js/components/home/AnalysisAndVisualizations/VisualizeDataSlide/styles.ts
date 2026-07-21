import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

/**
 * Outer scroll runway for the visualize slide.
 */
export const VisualizeScrollRunway = styled(Box)(({ theme }) => ({
  position: 'relative',

  [theme.breakpoints.up('md')]: {
    // Overlap the previous slide by one viewport so this slide slides up and covers it
    // (paired with its higher zIndex). Matches ScrollRunway's overlap.
    marginTop: '-100vh',
  },
}));

/**
 * Inner content for the visualize slide. Unlike the other two slides this one does NOT
 * pin: it holds a lot of content (title, description, 4-item selector, carousel) that can
 * exceed the viewport on short screens. A pinned slide taller than the viewport can't
 * scroll to reveal its bottom, so it flows normally instead — growing to fit its content
 * and scrolling through like a regular section, so nothing is clipped.
 */
export const VisualizeSlideContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4, 2),
  overflow: 'hidden',
  // Own stacking context so the z-index:-1 gradient stays behind this slide's content
  // (matches the parallax slides; needed on mobile where there's no sticky positioning).
  isolation: 'isolate',

  [theme.breakpoints.up('md')]: {
    // At least the viewport (below the sticky header); grows taller to fit its content.
    minHeight: `calc(100vh - ${headerHeight}px)`,
    // The gradient (AnimatedGradientLayer, inset 0) fills this padding too, so it reads as
    // the slide continuing rather than a blank gap. This tail is the runway the bottom
    // sections (ParallaxCover) slide up over: the 100vh matches ParallaxCover's -100vh
    // overlap, and the extra spacing leaves a breathing gap below the content so the cover
    // lands just past the selector instead of flush against it.
    paddingBottom: `calc(100vh + ${theme.spacing(8)})`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // Promote to a compositor layer (matches StickySlideContent) so sliding up over the
    // pinned previous slide composites instead of repainting the ~2-viewport gradient.
    willChange: 'transform',
  },
}));

export const AnimatedGradientLayer = styled(animated.div)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
});

export const SlideContentGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  padding: theme.spacing(0, 2),

  [theme.breakpoints.up('md')]: {
    display: 'grid',
    // Selector/side text takes 1/3, the media content takes 2/3.
    gridTemplateColumns: '1fr 2fr',
    gap: theme.spacing(4),
    // Top-align the columns (not center) so switching to the taller carousel view grows the
    // media downward instead of re-centering the row and shifting the selector column.
    alignItems: 'start',
  },
}));

export const ViewOptionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  cursor: 'pointer',
  // The active view stays transparent — it's indicated by its contained CTA button,
  // not a card background. Options are separated by dividers (see ViewSelector).
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.short,
  }),
  backgroundColor: 'transparent',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

// Wraps a non-carousel view's single image/webm so the optional CTA button can overlay it.
export const ViewMediaWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
});

export const SwipeContainer = styled(Box)({
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  touchAction: 'pan-y',
});

export const SwipeTrack = styled(Box)<{ $activeIndex: number }>(({ $activeIndex }) => ({
  display: 'flex',
  transform: `translateX(-${$activeIndex * 100}%)`,
  transition: 'transform 0.3s ease-in-out',
}));

export const SwipePanel = styled(Box)(({ theme }) => ({
  minWidth: '100%',
  padding: theme.spacing(1),
  boxSizing: 'border-box',
}));

export const PaginationDot = styled('button')<{ $isActive: boolean }>(({ theme, $isActive }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  backgroundColor: $isActive ? theme.palette.text.primary : theme.palette.grey[400],
  transition: theme.transitions.create('background-color'),

  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

/* -------- Single-cell Vitessce carousel (embla) --------
   Large selected image on top, with a scrollable strip of thumbnail previews below
   (~4.5 visible), each captioned with its assay + analyte. */

// Number of thumbnails visible in the preview strip at once.
const THUMBS_VISIBLE = 4.5;

export const CarouselRoot = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  // Cap the width so the 16:9 main image stays a contained size (its height follows
  // the width, so this also caps the carousel's height to fit the media area without
  // distorting the 16:9 ratio). Centered within the right-hand column.
  maxWidth: 780,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

// Wraps the main image so the prev/next arrows and the "View … Visualization" button overlay it.
export const MainImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
}));

export const MainImage = styled('img')({
  width: '100%',
  // Screenshots are 16:9 — match the box to that ratio so they aren't stretched/cropped.
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  display: 'block',
});

// "View <assay> Visualization" link overlaying the bottom-right of the main image.
// Fully styled (no MUI variant) so the theme's contained-button colors don't override it.
export const ViewVizButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1.5),
  bottom: theme.spacing(1.5),
  zIndex: 2,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(0.75, 1.5),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],

  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[6],
  },
}));

export const CarouselViewport = styled(Box)({
  overflow: 'hidden',
});

export const CarouselContainer = styled(Box)({
  display: 'flex',
});

export const ThumbSlide = styled(Box)(({ theme }) => ({
  flex: `0 0 ${100 / THUMBS_VISIBLE}%`,
  minWidth: 0,
  boxSizing: 'border-box',
  paddingRight: theme.spacing(1), // gap between thumbnails (inside the flex-basis)
}));

export const ThumbButton = styled('button')<{ $isActive: boolean }>(({ theme, $isActive }) => ({
  display: 'block',
  width: '100%',
  // Small inset so the focus ring can sit in a gap around the image + caption.
  padding: theme.spacing(0.5),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  cursor: 'pointer',
  textAlign: 'left',
  // Transparent — the caption sits on the slide's background, and the active outline
  // lives on the image itself (see ThumbImage), not around the whole button.
  background: 'transparent',
  border: 'none',
  opacity: $isActive ? 1 : 0.7,
  transition: theme.transitions.create('opacity'),

  '&:hover': {
    opacity: 1,
  },
  '&:focus-visible': {
    // Drawn INSET (negative offset) so the ring wraps the image + caption without being
    // clipped by the carousel viewport's `overflow: hidden` — a non-inset ring gets its
    // top/bottom edges clipped, leaving only the vertical segments visible.
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
  },
}));

export const ThumbImage = styled('img')<{ $isActive: boolean }>(({ theme, $isActive }) => ({
  width: '100%',
  // 16:9 like the source screenshots, so previews aren't stretched.
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  display: 'block',
  // Rounded preview with the active outline drawn only around the image.
  borderRadius: Number(theme.shape.borderRadius),
  border: `2px solid ${$isActive ? theme.palette.primary.main : 'transparent'}`,
  boxSizing: 'border-box',
}));

export const ThumbCaption = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0.5, 1),
}));

export const CarouselButton = styled(IconButton)<{ $side: 'left' | 'right' }>(({ theme, $side }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [$side]: theme.spacing(0.5),
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],

  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));
