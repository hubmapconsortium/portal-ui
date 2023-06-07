import React, { forwardRef } from 'react';
import Button from '@mui/material/Button';

const ImageCarouselButton = forwardRef(function ImageCarouselButton({ href }, ref) {
  return (
    <Button variant="outlined" color="primary" component="a" href={href} ref={ref}>
      Get Started
    </Button>
  );
});

export default ImageCarouselButton;
