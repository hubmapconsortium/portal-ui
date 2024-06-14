import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface HeroGridContainerProps extends BoxProps {
  $activeSlide: number;
}

export const HeroGridContainer = styled(Box)<HeroGridContainerProps>(({ theme }) => ({
  display: 'grid',
  width: '100%',
  // On mobile, the grid is a single column containing all the tabs
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      'tab0'
      'tab1'
      'tab2'
      'tab3'`,
  },
  // On desktop, the grid has a carousel panel on top and the tabs below
  [theme.breakpoints.up('md')]: {
    maxHeight: '36rem',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',

    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: `
      'panel panel panel panel'
      'tab0 tab1 tab2 tab3'
    `,
    transition: theme.transitions.create('grid-template-columns', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

interface HeroSubContainerProps extends BoxProps {
  $index: number;
  $activeSlide: number;
  $isImage?: boolean;
}

export const HeroTabContainer = styled(Box)<HeroSubContainerProps>(({ $index, $activeSlide, theme, ...props }) => ({
  gridArea: `tab${$index}`,

  [theme.breakpoints.up('md')]: {
    backgroundColor: $activeSlide === $index ? props.bgcolor : theme.palette.common.white,
    ':not(:last-child)': {
      borderRight: `1px solid ${theme.palette.grey[200]}`,
    },
  },
}));

export const HeroPanelContainer = styled(Box)<HeroSubContainerProps>(({ theme, $index, $activeSlide, $isImage }) => ({
  position: 'relative',

  [theme.breakpoints.up('md')]: {
    gridArea: `panel`,
    width: '100%',
    maxHeight: '22.5rem',
    opacity: $activeSlide === $index ? 1 : 0,
    speak: $activeSlide === $index ? 'auto' : 'none',
    left: $activeSlide === $index ? 0 : `${$activeSlide - $index}00%`,
    overflowY: !$isImage ? 'auto' : 'hidden',
    transition: theme.transitions.create(['max-width', 'opacity', 'left'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
  },
}));
