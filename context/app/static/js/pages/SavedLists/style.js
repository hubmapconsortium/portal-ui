import styled from 'styled-components';

const SeparatedFlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const FlexBottom = styled.div`
  display: flex;
  align-items: flex-end;
`;

export { SeparatedFlexRow, FlexBottom };
