import styled from 'styled-components';
import Typography from '@mui/material/Typography';

import LabelledSectionDate from 'js/shared-styles/sections/LabelledSectionDate';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;
const Flex = styled.div`
  display: flex;
`;

const StyledCreationDate = styled(LabelledSectionDate)`
  flex-grow: 1;
`;

const StyledModificationDate = styled(LabelledSectionDate)`
  flex-grow: 3;
`;

export { StyledTypography, Flex, StyledCreationDate, StyledModificationDate };
