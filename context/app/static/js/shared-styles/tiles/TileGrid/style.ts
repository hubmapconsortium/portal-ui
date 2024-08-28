import { styled } from '@mui/material/styles';

interface GridProps {
  $tileWidth: number;
}

const Grid = styled('div')<GridProps>(({ $tileWidth }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, ${$tileWidth}px)`,
  gridGap: '0.5rem',
  width: '100%',
  justifyContent: 'space-around',
  '@media (min-width: 1245px)': {
    justifyContent: 'space-between',
  },
}));

export { Grid };
