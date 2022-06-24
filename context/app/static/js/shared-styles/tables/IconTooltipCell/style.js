import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSvgIcon = styled(SvgIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
`;

export { Flex, StyledSvgIcon };
