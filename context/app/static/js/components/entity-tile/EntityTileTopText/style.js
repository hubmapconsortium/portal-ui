import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const Flex = styled.div`
  display: flex;
`;

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) => (props.$invertColors ? '#ffffff' : props.theme.palette.text.primary)};
  margin: 0px ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledDiv = styled.div`
  min-width: 0;
  flex-grow: 1;
`;

export { Flex, TruncatedTypography, StyledDivider, StyledDiv };
