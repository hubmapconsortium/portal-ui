import styled from 'styled-components';
import TabPanel from 'js/shared-styles/tabs/TabPanel';
import CenteredLoaderWrapper from 'js/shared-styles/loaders/CenteredLoaderWrapper';

const sectionHeight = 400; // px

const StyledDiv = styled.div`
  height: ${sectionHeight}px;
  display: flex;
  flex-direction: column;
`;

const StyledTabPanel = styled(TabPanel)`
  flex-grow: 1;
`;

const StyledCenteredLoaderWrapper = styled(CenteredLoaderWrapper)`
  height: ${sectionHeight}px;
`;

export { StyledDiv, StyledTabPanel, StyledCenteredLoaderWrapper };
