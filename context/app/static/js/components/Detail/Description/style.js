import styled from 'styled-components';
import InfoIcon from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';

const StyledPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledPaper, StyledInfoIcon };
