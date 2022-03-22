import styled from 'styled-components';

import { tileWidth } from 'js/components/entity-tile/EntityTile/style';

const TilesLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, ${tileWidth});
  grid-gap: 0.5rem;
  width: 100%;
  justify-content: space-around;

  @media (min-width: 1245px) {
    justify-content: space-between;
  }
`;

export { TilesLayout };
