import styled from 'styled-components';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';

const WidePopper = styled(Popper)`
  width: 100%;
`;

const WidePaper = styled(Paper)`
  width: 100%;
`;

const DropdownMenuItem = styled(MenuItem)`
  color: ${(props) => props.theme.palette.primary.main};
`;

export { WidePopper, WidePaper, DropdownMenuItem };
