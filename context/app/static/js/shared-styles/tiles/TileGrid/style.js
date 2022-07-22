import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat(auto-fill, ${props.$tileWidth}px)`};
  grid-gap: 0.5rem;
  width: 100%;
  justify-content: space-around;

  @media (min-width: 1245px) {
    justify-content: space-between;
  }
`;

export { Grid };
