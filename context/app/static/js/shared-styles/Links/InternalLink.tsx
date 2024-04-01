import React, { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import Link, { LinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';


interface Props extends LinkProps<'a'> {}

const StyledLink = styled(Link)<{ component: 'a' }>(({ theme }) => ({
  color: theme.palette.common.link,
})) as typeof Link;

function InternalLink(props: Props) {
  return <StyledLink component="a" {...props} />;
}

export default InternalLink;
