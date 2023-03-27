import styled from 'styled-components';
import List from '@material-ui/core/List';

const StyledList = styled(List)`
  list-style: 'disc';
  padding-left: ${(props) => props.theme.spacing(2.5)}px;
`;

export { StyledList };
