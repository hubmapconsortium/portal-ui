import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';

export const ImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
});

export const AnimatedImage = styled(animated.img)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'block',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  willChange: 'opacity, transform',
}));
