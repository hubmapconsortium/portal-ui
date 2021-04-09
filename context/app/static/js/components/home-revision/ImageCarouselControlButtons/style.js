import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

const FlexList = styled.ul`
  display: flex;
`;

const StyledIconButton = styled(IconButton)`
  // increase specificity to override disabled styles from mui
  && {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

export { FlexList, StyledIconButton };
