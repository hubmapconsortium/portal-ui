import { styled } from '@mui/material/styles';

// https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/
const StyledImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
});

export { StyledImage };
