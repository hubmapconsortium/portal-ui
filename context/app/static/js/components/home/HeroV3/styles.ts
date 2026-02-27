import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { BACKGROUND_FADE_DURATION_MS } from './const';

export const HeroSection = styled('section')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  // Extra bottom padding so the background extends behind the overlapping pill bar
  paddingBottom: theme.spacing(5),
}));

export const HeroContentContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  padding: theme.spacing(6, 2),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(8, 2),
  },
}));

export const BackgroundContainer = styled('div')({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
});

interface BackgroundLayerProps {
  $active: boolean;
  $color: string;
}

export const BackgroundLayer = styled('div')<BackgroundLayerProps>(({ $active, $color }) => ({
  position: 'absolute',
  inset: 0,
  opacity: $active ? 1 : 0,
  transition: `opacity ${BACKGROUND_FADE_DURATION_MS}ms ease-out`,
  background: `linear-gradient(135deg, ${$color} 0%, ${$color}88 50%, ${$color}44 100%)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

export const CardContainer = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.common.white,
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export const CardVideoContainer = styled('div')({
  width: 180,
  height: 135,
  borderRadius: 4,
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: '#f5f5f5',
  '& video, & img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

export const PillBar = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
}));

export const PillBarOuter = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 112, // headerHeight (appBarHeight 64 + bannerHeight 40)
  zIndex: theme.zIndex.header - 1,
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(-11.5), // overlap the hero section's extra bottom padding
  paddingBottom: theme.spacing(3),
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  // When not stuck, pill bar fills the container width
  [`& ${PillBar}`]: {
    maxWidth: '100%',
    width: '100%',
    py: 1,
    transition: theme.transitions.create(['max-width', 'box-shadow', 'border-radius', 'padding', 'margin']),
    margin: 0,

    [`& ${BottomBarLink}`]: {
      padding: theme.spacing(3, 2),
    },
  },
  // When stuck, shrink via max-width
  '&.stuck': {
    padding: theme.spacing(0, 2),
    [`& ${PillBar}`]: {
      maxWidth: 700,
      boxShadow: theme.shadows[3],
      borderRadius: theme.spacing(0.5),
      py: 0,
      // Add margin to bar to compensate for reduced padding on the links
      // This prevents scrolling from causing a layout shift due to the
      // change in height when the bar becomes sticky
      // 2 to make up for py reduction on pillbar, 2 to make up for padding reduction on links
      marginBottom: theme.spacing(4),

      [`& ${BottomBarLink}`]: {
        padding: theme.spacing(1, 1.5),
      },
    },
  },
}));

export const BottomBarLink = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flex: 1,
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['background-color', 'padding', 'margin']),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const BottomBarDivider = styled('div')(({ theme }) => ({
  width: 1,
  alignSelf: 'stretch',
  backgroundColor: theme.palette.divider,
  flexShrink: 0,
}));
