import styled from 'styled-components';
import Description from 'js/shared-styles/sections/Description';

const StyledDescription = styled(Description)`
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

export { StyledDescription };
