import styled from 'styled-components';
import MenuItem from '@mui/material/MenuItem';

// default padding for a MenuItem is 16px or spacing(2)
const StyledMenuItem = styled(MenuItem)`
  padding-left: ${(props) => (props.$isIndented ? props.theme.spacing(5) : props.theme.spacing(2))}px;
  color: ${(props) => props.theme.palette.primary.main};
`;

export { StyledMenuItem };
