import React from 'react';
import Link from '@material-ui/core/Link';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';
import styled from 'styled-components';

function LinkWithoutUnderline(props) {
  return <Link {...props} underline="none" />;
}

const LightBlueLink = styled(LinkWithoutUnderline)`
  color: ${(props) => props.theme.palette.info.main};
`;

const StyledOpenInNewRoundedIcon = styled(OpenInNewRoundedIcon)`
  font-size: 1.1rem;
  vertical-align: text-bottom;
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
`;

export { StyledOpenInNewRoundedIcon, LightBlueLink };
