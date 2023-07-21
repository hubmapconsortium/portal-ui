import styled from 'styled-components';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';

const StyledSectionHeader = styled(SectionHeader)`
  display: flex;
  align-items: center;
  svg {
    margin-left: ${(props) => props.theme.spacing(0.5)}px;
  }
`;

export { StyledSectionHeader };
