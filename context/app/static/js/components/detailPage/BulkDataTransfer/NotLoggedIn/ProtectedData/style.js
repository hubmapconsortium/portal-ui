import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import styled, { css } from 'styled-components';

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

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)}px;
  border-bottom: 1px solid #e0e0e0;
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

const LinkTitle = styled(Typography)`
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`;

const GreenCheckCircleIcon = styled(CheckCircleIcon)`
  color: ${(props) => props.theme.palette.success.main};
`;

export {
  StyledContainer,
  Header,
  ContentText,
  LoginButton,
  LinkContainer,
  StyledLink,
  LinkTitle,
  GreenCheckCircleIcon,
};
