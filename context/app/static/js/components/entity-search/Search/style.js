import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

const Grow = styled.div`
  flex-grow: 1;
`;

export { Flex, Grow };
