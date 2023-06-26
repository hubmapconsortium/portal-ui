import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const StyledContainer = styled.div`
  > div {
    margin-bottom: 10px;
  }
`;
const Header = styled(Typography)`
  margin: 0px ${(props) => props.theme.spacing(1)}px ${(props) => props.theme.spacing(1)}px 0px;
  display: flex;
  align-items: center;

  svg {
    margin-left: 4px;
  }
`;

const LoginButton = styled(Button)`
  border-radius: 4px;
  margin-top: 10px;
`;

const ExternalLink = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const StyledLink = styled(Typography)`
  display: flex;
  align-items: center;
`;

export { StyledContainer, Header, LoginButton, ExternalLink, StyledLink };
