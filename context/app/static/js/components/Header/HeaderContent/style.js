import styled from 'styled-components';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const Spacer = styled.div`
  flex-grow: 1;
`;

const HeaderButton = styled(Button)`
  margin-left: 10px;
  color: ${(props) => props.theme.palette.white.main};
`;

const FlexNoWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const StyledDivider = styled(Divider)`
  margin: ${(props) => props.theme.spacing(0.5)} 0px;
`;

export { Spacer, HeaderButton, FlexNoWrap, StyledDivider };
