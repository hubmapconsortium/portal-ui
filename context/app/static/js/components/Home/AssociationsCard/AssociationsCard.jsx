import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, StyledLink } from './style';

function AssociationsCard(props) {
  const { title, text, link, children, mb } = props;
  return (
    <Card mb={mb}>
      {children}
      <Typography variant="h5" component="h4">
        {title}
      </Typography>
      <Typography variant="body2" color="secondary">
        {text}
      </Typography>
      <StyledLink variant="body2" href={link} target="_blank" rel="noopener noreferrer">
        LEARN MORE
      </StyledLink>
    </Card>
  );
}

export default AssociationsCard;
