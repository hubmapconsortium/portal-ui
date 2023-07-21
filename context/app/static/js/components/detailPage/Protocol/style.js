import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';

const StyledPaper = styled(Paper)`
  padding: 20px 40px 20px 40px;
`;

const StyledSectionHeader = styled(SectionHeader)`
  display: flex;
  align-items: center;
  svg {
    margin-left: ${(props) => props.theme.spacing(0.5)}px;
  }
`;

export { StyledPaper, StyledSectionHeader };
