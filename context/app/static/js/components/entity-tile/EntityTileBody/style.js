import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const Flex = styled.div`
  display: flex;
  min-width: 0;
`;

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) =>
    props.$invertColors ? props.theme.palette.white.main : props.theme.palette.text.primary};
  margin: 0px ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledDiv = styled.div`
  width: 100%;
`;

export { Flex, TruncatedTypography, StyledDivider, StyledDiv };
