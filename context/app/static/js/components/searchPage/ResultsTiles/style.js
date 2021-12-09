import styled from 'styled-components';

const TilesLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 1rem;
  width: 100%;
  justify-content: space-around;

  @media (min-width: 1245px) {
    justify-content: space-between;
  }
`;

export { TilesLayout };
