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
    margin-bottom: ${(props) => props.theme.spacing(1.25)};
  }
`;

const Header = styled(Typography)`
  ${({ theme: { spacing } }) => css`
    margin: ${spacing(0, 1, 1, 0)};
    display: flex;
    align-items: center;

    svg {
      margin-left: ${spacing(0.5)};
    }
  `}
`;

const ContentText = styled(Typography)`
  padding: ${(props) => props.theme.spacing(1.25)} 0;
`;

const LoginButton = styled(Button)`
  ${({ theme: { spacing } }) => css`
    border-radius: ${spacing(0.5)};
  `}
`;

const LinkContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)};
`;

const StyledLink = styled(Typography)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: ${(props) => props.theme.spacing(1.25)};

  svg {
    margin-right: ${(props) => props.theme.spacing(0.5)};
  }
`;

const GreenCheckCircleIcon = styled(CheckCircleIcon)`
  color: ${(props) => props.theme.palette.success.main};
`;

const StyledBlockIcon = styled(BlockIcon)`
  color: ${(props) => props.theme.palette.warning.main};
`;

const StyledErrorIcon = styled(ErrorIcon)`
  color: ${(props) => props.theme.palette.error.main};
`;

const ObliqueSpan = styled.span`
  font-style: oblique 10deg;
`;

const StyledHeader = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)} 0px;
`;

const StyledDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const StyledWarningIcon = styled(WarningRoundedIcon)`
  color: ${(props) => props.theme.palette.warning.main};
`;

const IconContainer = styled.div`
  float: left;
  margin-right: ${(props) => props.theme.spacing(1)};
`;

const NoAccessContainer = styled.div`
  display: ${(props) => props.displayValue};
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
  StyledErrorIcon,
  ObliqueSpan,
  StyledHeader,
  StyledDiv,
  StyledWarningIcon,
  IconContainer,
  NoAccessContainer,
};
