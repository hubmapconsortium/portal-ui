import React from 'react';
import Link from '@mui/material/Link';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
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
  margin-left: ${(props) => props.theme.spacing(0.5)};
`;

export { StyledOpenInNewRoundedIcon, LightBlueLink };
