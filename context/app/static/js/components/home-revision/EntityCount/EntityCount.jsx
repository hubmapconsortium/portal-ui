import React from 'react';
import Typography from '@material-ui/core/Typography';
import { StyledLink, Flex, StyledSvgIcon } from './style';

function EntityCount({ icon, count, label, href }) {
  return (
    <StyledLink href={href}>
      <Flex>
        <StyledSvgIcon component={icon} color="primary" />
        <div>
          <Typography variant="h2" component="p">
            {count}
          </Typography>
          <Typography variant="h6" component="p">
            {label}
          </Typography>
        </div>
      </Flex>
    </StyledLink>
  );
}

export default EntityCount;
