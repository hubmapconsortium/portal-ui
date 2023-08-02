import styled from 'styled-components';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const baseOffset = headerHeight + 10;
/* Anchor offset for fixed header.
Only to be used on pages with table of contents. */
const Section = styled.section`
  margin-bottom: ${(props) => props.theme.spacing(5)};
  scroll-margin-top: ${baseOffset}px;
`;

export { baseOffset };
export default Section;
