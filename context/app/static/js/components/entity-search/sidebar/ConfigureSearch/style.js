import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import DialogContent from '@mui/material/DialogContent';

const Flex = styled.div`
  display: flex;
`;

const StyledPaper = styled(Paper)`
  height: 100%;
  overflow-y: visible;
`;

const StyledDialogContent = styled(DialogContent)`
  flex-grow: 1;
  min-height: 0px;
  display: flex;
  flex-direction: column;
  overflow-y: visible;
`;

export { Flex, StyledPaper, StyledDialogContent };
