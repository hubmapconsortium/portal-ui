import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export const ImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
});

// Shared appearance for both the <img> and <video> media slots.
const mediaStyles = (theme: Theme) => ({
  width: '100%',
  height: 'auto',
  display: 'block',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[4],
});

export const SlideImg = styled('img')(({ theme }) => mediaStyles(theme));

export const SlideVideo = styled('video')(({ theme }) => mediaStyles(theme));
