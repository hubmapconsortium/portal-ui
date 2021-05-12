import React from 'react';
import Button from '@material-ui/core/Button';

function ImageCarouselButton({ href }) {
  return (
    <Button variant="outlined" color="primary" component="a" href={href}>
      Get Started
    </Button>
  );
}

export default ImageCarouselButton;
