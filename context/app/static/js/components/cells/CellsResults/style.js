import styled from 'styled-components';
import { Alert } from 'js/shared-styles/alerts';

const initialHeight = 300;

const CenteredFlex = styled.div`
  width: 100%;
  min-height: ${initialHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FullWidthAlert = styled(Alert)`
  width: 100%;
`;

export { CenteredFlex, FullWidthAlert, initialHeight };
