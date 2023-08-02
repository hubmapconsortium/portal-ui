import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';

const CenteredFlex = styled.div`
  margin-top: 5px;
  display: flex;
  justify-content: center;
`;

const StyledPaper = styled(Paper)`
  width: fit-content;
  padding: 10px;
  border-radius: 5px;
`;

const FlexButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px;
  margin: 0px;
`;

const StyledIconButton = styled(IconButton)`
  // mui uses padding for icon button sizes which causes buttons with different size icons to vary in size
  box-sizing: border-box;
  width: 30px;
  height: 30px;
`;

export { StyledPaper, FlexButtonsWrapper, CenteredFlex, StyledIconButton };
