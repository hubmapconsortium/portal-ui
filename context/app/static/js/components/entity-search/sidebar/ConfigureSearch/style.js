import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';

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
