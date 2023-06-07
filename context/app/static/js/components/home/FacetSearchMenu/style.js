import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { Alert } from 'js/shared-styles/alerts';
import { inputPadding } from 'js/components/home/FacetSearch/style';

const StyledPaper = styled(Paper)`
  margin-top: ${(props) => props.theme.spacing(1)};
  max-height: 260px; // 250px in the mockup, but added 10px so it's clearly scrollable
  overflow-y: scroll;
  width: 100%;
`;

const StyledPopper = styled(Popper)`
  width: ${(props) => props.$searchInputWidth + inputPadding * 2}px;
`;

const StyledAlert = styled(Alert)`
  border: 0;
`;

const StyledTypography = styled(Typography)`
  padding: 6px 16px;
`;

const HeaderSkeleton = styled(Skeleton)`
  max-width: 200px;
`;

export { StyledPaper, StyledPopper, StyledAlert, StyledTypography, HeaderSkeleton };
