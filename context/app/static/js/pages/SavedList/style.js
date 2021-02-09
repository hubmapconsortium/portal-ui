import styled from 'styled-components';

import RightAlignedButtonRow from 'js/shared-styles/sections/RightAlignedButtonRow';

const StyledButtonRow = styled(RightAlignedButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledButtonRow };
