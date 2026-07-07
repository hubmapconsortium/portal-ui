import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';

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
  willChange: 'opacity, transform',
});

export const AnimatedImage = styled(animated.img)(({ theme }) => mediaStyles(theme));

export const AnimatedVideo = styled(animated.video)(({ theme }) => mediaStyles(theme));
