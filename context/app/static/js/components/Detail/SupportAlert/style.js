import styled from 'styled-components';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
  // Need to put this above the section container on the z-index stack due to the padding/margin offset fix for the anchor links.
  position: relative;
  z-index: ${(props) => props.theme.zIndex.interactiveContentAboveDetailSection};
`;

export { StyledAlert };
