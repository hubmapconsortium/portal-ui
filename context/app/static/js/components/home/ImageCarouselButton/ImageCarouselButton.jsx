import React from 'react';
import Button from '@mui/material/Button';
import { useExternalUrlProps } from 'js/hooks/useIsExternalUrl';

function ImageCarouselButton({ href }) {
  const outboundProps = useExternalUrlProps(href);
  return (
    <Button variant="outlined" color="primary" component="a" href={href} {...outboundProps}>
      Get Started
    </Button>
  );
}

export default ImageCarouselButton;
