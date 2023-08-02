import styled from 'styled-components';

import Description from 'js/shared-styles/sections/Description';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

// 88px = header height + header margin
const PageWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(5)};
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: calc(100vh - ${headerHeight + 24}px);
    display: flex;
    flex-direction: column;
  }
`;

const StyledDescription = styled(Description)`
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

export { PageWrapper, StyledDescription };
