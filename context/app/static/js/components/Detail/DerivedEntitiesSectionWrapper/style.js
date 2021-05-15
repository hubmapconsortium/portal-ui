import styled from 'styled-components';
import CenteredLoaderWrapper from 'js/shared-styles/loaders/CenteredLoaderWrapper';

const sectionHeight = 400; // px

const StyledDiv = styled.div`
  height: ${sectionHeight}px;
  display: flex;
  flex-direction: column;
`;

const StyledCenteredLoaderWrapper = styled(CenteredLoaderWrapper)`
  height: ${sectionHeight}px;
`;

export { StyledDiv, StyledCenteredLoaderWrapper };
