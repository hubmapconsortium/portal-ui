import styled from 'styled-components';
import RightAlignedButtonRow from 'js/shared-styles/sections/RightAlignedButtonRow';
import Typography from '@material-ui/core/Typography';

const StyledButtonRow = styled(RightAlignedButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
  min-height: 40px;
`;

const BottomAlignedTypography = styled(Typography)`
  align-self: flex-end;
`;

export { StyledButtonRow, BottomAlignedTypography };
