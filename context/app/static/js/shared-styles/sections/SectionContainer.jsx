import styled from 'styled-components';

/* Anchor offset for fixed header
74px = fixed header height + 10px */
const SectionContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
  padding-top: 74px;
  margin-top: -74px;
`;

export default SectionContainer;
