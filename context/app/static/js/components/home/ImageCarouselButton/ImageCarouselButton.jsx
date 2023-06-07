import React from 'react';
import Button from '@mui/material/Button';

function ImageCarouselButton({ href }) {
  return (
    <Button variant="outlined" color="primary" component="a" href={href}>
      Get Started
    </Button>
  );
}

export default ImageCarouselButton;
