import styled from 'styled-components';
import Container from '@mui/material/Container';
import ToggleButton from '@mui/material/ToggleButton';
import SvgIcon from '@mui/material/SvgIcon';

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 1.5rem;
  color: ${(props) => props.theme.palette.primary.main};
  margin-right: ${(props) => props.theme.spacing(1)};
`;

const FlexContainer = styled(Container)`
  display: flex;
  height: 100%;
  align-items: center;
`;

const FullscreenToggleButton = styled(ToggleButton)`
  border: 0px;
  padding: 0px 10px;
  height: 35px;
`;

const RightDiv = styled.div`
  margin-left: auto;
  display: flex;
  height: 100%;
`;

export { StyledSvgIcon, FlexContainer, FullscreenToggleButton, RightDiv };
