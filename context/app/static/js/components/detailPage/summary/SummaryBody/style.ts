import { styled } from '@mui/material/styles';

import LabelledSectionDate from 'js/shared-styles/sections/LabelledSectionDate';

const StyledCreationDate = styled(LabelledSectionDate)({
  flexGrow: 1,
});

const StyledModificationDate = styled(LabelledSectionDate)({
  flexGrow: 3,
});

export { StyledCreationDate, StyledModificationDate };
