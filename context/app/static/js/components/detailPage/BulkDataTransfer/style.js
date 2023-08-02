import styled, { css } from 'styled-components';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/Error';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

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

const StyledBlockIcon = styled(BlockIcon)`
  color: ${(props) => props.theme.palette.warning.main};
`;

const StyledExclamationIcon = styled(ErrorIcon)`
  color: ${(props) => props.theme.palette.error.main};
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

export {
  StyledContainer,
  Header,
  ContentText,
  LoginButton,
  LinkContainer,
  StyledLink,
  GreenCheckCircleIcon,
  StyledBlockIcon,
  StyledExclamationIcon,
  ObliqueSpan,
  StyledHeader,
  StyledDiv,
  StyledWarningIcon,
  WarningIconContainer,
  NoAccessContainer,
};
