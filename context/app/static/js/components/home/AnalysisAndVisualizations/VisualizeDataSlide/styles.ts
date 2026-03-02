import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import Box from '@mui/material/Box';

/**
 * Outer scroll runway for the visualize slide.
 */
export const VisualizeScrollRunway = styled(Box)(({ theme }) => ({
  position: 'relative',

  [theme.breakpoints.up('md')]: {
    height: '180vh',
  },
}));

/**
 * Inner sticky content for the visualize slide.
 */
export const VisualizeSlideContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4, 2),
  overflow: 'hidden',

  [theme.breakpoints.up('md')]: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    gridTemplateColumns: '4fr 5fr',
    gap: theme.spacing(4),
    alignItems: 'center',
  },
}));

interface ViewOptionContainerProps {
  $isActive: boolean;
}

export const ViewOptionContainer = styled(Box)<ViewOptionContainerProps>(({ theme, $isActive }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  backgroundColor: $isActive ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
  boxShadow: $isActive ? theme.shadows[1] : 'none',

  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export const ImageArea = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  position: 'relative',
  minHeight: 300,

  [theme.breakpoints.up('md')]: {
    minHeight: 400,
  },
}));

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
