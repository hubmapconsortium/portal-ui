import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import SvgIcon from '@material-ui/core/SvgIcon';

const Spacer = styled.div`
  flex-grow: 1;
`;

const HeaderButton = styled(Button)`
  color: ${(props) => props.theme.palette.white.main};
  // border: 1px pink solid;

  button {
    padding: 0px;
  }
`;

const FlexNoWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const StyledDivider = styled(Divider)`
  margin: ${(props) => props.theme.spacing(0.5)}px 0px;
`;

const HeaderType = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing(1)}px;
`;

const StyledSvgIcon = styled(SvgIcon)`
  margin-top: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1.25rem;
`;

export { Spacer, HeaderButton, FlexNoWrap, StyledDivider, StyledSvgIcon, HeaderType };
