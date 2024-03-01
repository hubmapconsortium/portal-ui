import styled from 'styled-components';
import InfoIcon from '@mui/icons-material/Info';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)`
  display: flex;
  padding: 24px;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(2)};
`;

export { StyledPaper, StyledInfoIcon };
