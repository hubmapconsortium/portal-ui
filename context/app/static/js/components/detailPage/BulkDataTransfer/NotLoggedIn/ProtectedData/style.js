import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const StyledContainer = styled.div`
  > div {
    margin-bottom: 10px;
  }
`;
const StyledTypography = styled(Typography)`
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

export { StyledContainer, StyledTypography, LoginButton };
