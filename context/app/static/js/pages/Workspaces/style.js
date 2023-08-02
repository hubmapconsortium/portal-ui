import styled from 'styled-components';

import Description from 'js/shared-styles/sections/Description';

const StyledDescription = styled(Description)`
  padding: ${(props) => props.theme.spacing(2.5)};
`;

export { StyledDescription };
