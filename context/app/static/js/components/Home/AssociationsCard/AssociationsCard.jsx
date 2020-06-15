import React from 'react';
import PropTypes from 'prop-types';
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

AssociationsCard.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  mb: PropTypes.number,
};

AssociationsCard.defaultProps = {
  mb: 0,
};

export default React.memo(AssociationsCard);
