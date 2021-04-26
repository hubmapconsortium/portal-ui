import React from 'react';
import Typography from '@material-ui/core/Typography';
import { StyledTypography } from './style';

function ImageCarouselCallToAction({ title, body }) {
  return (
    <div>
      <StyledTypography variant="h3">{title}</StyledTypography>
      <Typography variant="h6" component="p">
        {body}
      </Typography>
    </div>
  );
}

export default ImageCarouselCallToAction;
