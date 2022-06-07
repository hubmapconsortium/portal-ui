import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const Grow = styled.div`
  flex-grow: 1;
`;

const ResultsLayout = styled.div`
  flex-grow: 1;
  min-width: 0; // needed for horizontal scrolling table
  display: flex;
  flex-direction: column;
`;

export { Flex, Grow, ResultsLayout };
