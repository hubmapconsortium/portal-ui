import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

import CenteredLoaderWrapper from 'js/shared-styles/loaders/CenteredLoaderWrapper';

const sectionHeight = 335; // px

const StyledCenteredLoaderWrapper = styled(CenteredLoaderWrapper)`
  height: ${sectionHeight}px;
`;

const RelatedEntitiesPaper = styled(Paper)`
  height: ${sectionHeight}px;
  display: flex;
  flex-direction: column;
`;

export { StyledCenteredLoaderWrapper, RelatedEntitiesPaper };
