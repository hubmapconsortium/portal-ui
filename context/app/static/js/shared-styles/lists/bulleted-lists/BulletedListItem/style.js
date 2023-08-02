import styled from 'styled-components';

import ListItem from '@mui/material/ListItem';

const StyledListItem = styled(ListItem)`
  display: list-item;
  list-style: disc;
  padding: ${(props) => `0px ${props.theme.spacing(1.5)}`};
`;

export { StyledListItem };
