import React from 'react';
import Button from '@material-ui/core/Button';

function CarouselButton({ href, ...props }) {
  return (
    <Button variant="outlined" color="primary" component="a" href={href} {...props}>
      Get Started
    </Button>
  );
}

export default CarouselButton;
