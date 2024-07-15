import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import CenteredLoaderWrapper from 'js/shared-styles/loaders/CenteredLoaderWrapper';

const sectionHeight = 335; // px

const StyledCenteredLoaderWrapper = styled(CenteredLoaderWrapper)({
  height: sectionHeight,
});

const RelatedEntitiesPaper = styled(Paper)({
  height: sectionHeight,
  display: 'flex',
  flexDirection: 'column',
});

export { StyledCenteredLoaderWrapper, RelatedEntitiesPaper };
