import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface HeroGridContainerProps extends BoxProps {
  $activeSlide: number;
  $index: number;
}

export const HeroGridContainer = styled(Box)<HeroGridContainerProps>(({ theme, $activeSlide }) => ({
  display: 'grid',
  width: '100%',
  // On mobile, the grid is a single column containing all the tabs
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'repeat(4, auto max-content)',
    gridTemplateAreas: `
      'panel0'
      'tab0'
      'panel1'
      'tab1'
      'panel2'
      'tab2'
      'panel3'
      'tab3'
      `,
  },
  // On desktop, the grid has the panel on top and the tabs below
  [theme.breakpoints.up('md')]: {
    maxHeight: '36rem',
    width: '100%',
    position: 'relative',

    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      '${Array.from({ length: 4 })
        .map(() => `panel${$activeSlide}`)
        .join(' ')}'
      'tab0 tab1 tab2 tab3'
    `,
    '& > :not(:first-child)': {
      borderRight: `1px solid ${theme.palette.grey[200]}`,
      '&:last-child': {
        borderRight: '0px solid transparent',
      },
    },
  },
}));

interface HeroSubContainerProps extends BoxProps {
  $index: number;
  $activeSlide: number;
}

export const HeroTabContainer = styled(Box)<HeroSubContainerProps>(({ $index }: HeroSubContainerProps) => ({
  gridArea: `tab${$index}`,
}));

export const HeroPanelContainer = styled(Box)<HeroSubContainerProps>(({ theme, $index, $activeSlide }) => ({
  gridArea: `panel${$index}`,
  aspectRatio: '32/9',
  width: '100%',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    maxHeight: '22.5rem',
    display: $activeSlide === $index ? 'block' : 'none',
    overflow: 'auto',
  },
}));
