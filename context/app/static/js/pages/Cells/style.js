import styled from 'styled-components';

const initialHeight = 300;

const CenteredFlex = styled.div`
  width: 100%;
  min-height: ${initialHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export { CenteredFlex, initialHeight };
