import styled from 'styled-components';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const WidePopper = styled(Popper)`
  width: 100%;
`;

const WidePaper = styled(Paper)`
  width: 100%;
`;

const ShowcaseMenuItem = styled(MenuItem)`
  color: ${(props) => props.theme.palette.primary.main};
`;

export { WidePopper, WidePaper, ShowcaseMenuItem };
