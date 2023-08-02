import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';

const FlexList = styled.ul`
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
  // increase specificity to override disabled styles from mui
  && {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

export { FlexList, StyledIconButton };
