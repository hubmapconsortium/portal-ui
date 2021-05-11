import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import Button from '@material-ui/core/Button';

const CenteredDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 48px; /* to offset for the button size */
  padding: ${(props) => props.theme.spacing(1)}px;
`;

const Flex = styled.div`
  display: flex;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
  padding: ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledButton = styled(Button)`
  color: #fff !important; // Chrome sees the color, but doesn't always respect it unless forced.
  padding: 6px 36px;
`;

export { CenteredDiv, Flex, StyledTypography, StyledPaper, StyledInfoIcon, StyledButton };
