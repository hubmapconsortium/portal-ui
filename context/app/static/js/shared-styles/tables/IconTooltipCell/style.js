import styled from 'styled-components';
import SvgIcon from '@mui/material/SvgIcon';

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSvgIcon = styled(SvgIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)};
`;

export { Flex, StyledSvgIcon };
