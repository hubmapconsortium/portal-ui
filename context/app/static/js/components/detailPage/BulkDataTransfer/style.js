import styled, { css } from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Box from '@material-ui/core/Box';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import { LightBlueLink } from 'js/shared-styles/Links';
import { ExternalLinkIcon } from 'js/shared-styles/icons';

const StyledContainer = styled.div`
  > div {
    margin-bottom: ${(props) => props.theme.spacing(1.25)}px;
  }
`;

const Header = styled(Typography)`
  ${({ theme: { spacing } }) => css`
    margin: 0px, ${spacing(1)}px, ${spacing(1)}px, 0px;
    display: flex;
    align-items: center;

    svg {
      margin-left: ${spacing(0.5)}px;
    }
  `}
`;

const ContentText = styled(Typography)`
  padding: ${(props) => props.theme.spacing(1.25)}px 0;
`;

const LoginButton = styled(Button)`
  ${({ theme: { spacing } }) => css`
    border-radius: ${spacing(0.5)}px;
  `}
`;

const LinkContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)}px;
`;

const StyledLink = styled(Typography)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: ${(props) => props.theme.spacing(1.25)}px;

  svg {
    margin-right: ${(props) => props.theme.spacing(0.5)}px;
  }
`;

const GreenCheckCircleIcon = styled(CheckCircleIcon)`
  color: ${(props) => props.theme.palette.success.main};
`;

const AlignedLink = styled(LightBlueLink)`
  vertical-align: baseline;
`;

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
  font-size: 1rem;
  vertical-align: top;
`;

const ObliqueSpan = styled.span`
  font-style: oblique 10deg;
`;

const StyledHeader = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)}px 0px;
`;

const StyledDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const StyledWarningIcon = styled(WarningRoundedIcon)`
  color: ${(props) => props.theme.palette.warning.main};
`;

const WarningIconContainer = styled.div`
  float: left;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const NoAccessContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GlobusLinks = styled.div`
  > div {
    margin-bottom: ${(props) => props.theme.spacing(1.25)}px;
  }
`;

const GlobusSectionPaper = styled.div`
  padding: ${(props) => props.theme.spacing(2)}px;
`;

export {
  StyledContainer,
  Header,
  ContentText,
  LoginButton,
  LinkContainer,
  StyledLink,
  GreenCheckCircleIcon,
  AlignedLink,
  StyledExternalLinkIcon,
  ObliqueSpan,
  StyledHeader,
  StyledDiv,
  StyledWarningIcon,
  WarningIconContainer,
  NoAccessContainer,
  GlobusLinks,
  GlobusSectionPaper,
};
