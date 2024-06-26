import { styled } from '@mui/material/styles';

interface StyledRectProps {
  $showHover: boolean;
}

const StyledRect = styled('rect')<StyledRectProps>(({ $showHover }) => ({
  '&:hover': {
    filter: $showHover ? 'brightness(50%)' : undefined,
  },
}));

export { StyledRect };
