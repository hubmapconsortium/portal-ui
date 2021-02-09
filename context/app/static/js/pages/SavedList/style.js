import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import RightAlignedButtonRow from 'js/shared-styles/sections/RightAlignedButtonRow';

const StyledButtonRow = styled(RightAlignedButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const BottomAlignedTypography = styled(Typography)`
  align-self: flex-end;
`;

export { StyledButtonRow, BottomAlignedTypography };
