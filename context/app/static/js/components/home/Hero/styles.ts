import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

export const HeroSection = styled('section')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  // Extends the background down behind the overlapping pill bar to the counts bar.
  // Pairs with PillBarOuter's marginTop: this padding sets how far the background
  // reaches (and the card→bar gap); the marginTop closes the gap to the counts bar.
  // ponytail: eyeball both against the live page.
  paddingBottom: theme.spacing(8),
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

interface BackgroundImageLayerProps {
  $active: boolean;
  $transitionDuration: number;
}

export const BackgroundImageLayer = styled('div')<BackgroundImageLayerProps>(({ $active, $transitionDuration }) => ({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  opacity: $active ? 1 : 0,
  transition: `opacity ${$transitionDuration}ms ease-out`,
  '& picture, & img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
}));

export const BackgroundOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'rgba(255, 255, 255, 0.4)',
  zIndex: 1,
});

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
  top: 112, // headerHeight (appBarHeight 64 + bannerHeight 40 + 8px spacing)
  zIndex: theme.zIndex.header - 1,
  display: 'flex',
  justifyContent: 'center',
  // Pulls the bar up to overlap the hero background. Its magnitude should ~match the
  // bar's own height so the section's background meets the counts bar with no gap
  // (too little → white gap below the bar; too much → background overlaps counts).
  // Card→bar spacing is tuned via HeroSection's paddingBottom. ponytail: eyeball both.
  marginTop: theme.spacing(-13),
  paddingBottom: theme.spacing(3),
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  // When not stuck, pill bar fills the container width
  [`& ${PillBar}`]: {
    maxWidth: '100%',
    width: '100%',
    paddingY: 1,
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
      paddingY: 0,
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
