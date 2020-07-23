import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import { FileIcon } from 'shared-styles/icons';

const FlexContainer = styled.div`
  display: flex;
`;

const FlexCenterAlign = styled(FlexContainer)`
  align-items: center;
`;

const FlexColumn = styled(FlexContainer)`
  flex-direction: column;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const FlexBottomRight = styled(FlexRight)`
  align-items: flex-end;
`;

const FlexColumnRight = styled(FlexRight)`
  flex-direction: column;
  justify-content: space-evenly;
  white-space: nowrap;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  min-height: 155px;
  padding: 30px 40px 30px 40px;
`;

const StyledFileIcon = styled(FileIcon)`
  font-size: 1.2rem;
`;

const JsonButton = styled(IconButton)`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
`;

const StyledDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export {
  FlexContainer,
  FlexCenterAlign,
  FlexColumn,
  FlexRight,
  FlexBottomRight,
  FlexColumnRight,
  StyledPaper,
  JsonButton,
  StyledFileIcon,
  StyledDiv,
};
