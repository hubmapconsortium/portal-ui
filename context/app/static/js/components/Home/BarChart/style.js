import styled from 'styled-components';

const Placeholder = styled.div`
  grid-area: bar;
  background-color: ${(props) => props.theme.palette.transparentGray.main};
  height: 750px;
`;

export { Placeholder };
