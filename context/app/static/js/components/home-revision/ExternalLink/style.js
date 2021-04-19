import styled from 'styled-components';

const Flex = styled.div`
  padding: ${(props) => props.theme.spacing(1)}px;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

export { Flex };
