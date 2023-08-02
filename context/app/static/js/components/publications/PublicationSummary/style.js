import styled from 'styled-components';

export const DateContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(6)};
`;
