import React from 'react';
import Link, { LinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.link,
})) as typeof Link;

function InternalLink(props: LinkProps) {
  return <StyledLink {...props} />;
}

export default InternalLink;
