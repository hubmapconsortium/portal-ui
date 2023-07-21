import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

const StyledSectionHeader = styled(SectionHeader)`
  display: flex;
  align-items: center;
  svg {
    margin-left: ${(props) => props.theme.spacing(0.5)}px;
  }
`;

export { StyledTypography, FlexPaper, StyledSectionHeader };
