import React from 'react';
import styled from 'styled-components';
import Link from '@material-ui/core/Link';

function LinkWithoutUnderline(props) {
  return <Link {...props} underline="none" />;
}

const LightBlueLink = styled(LinkWithoutUnderline)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { LightBlueLink };
