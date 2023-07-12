import styled from 'styled-components';

const StyledDiv = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  min-height: 0px; // flex overflow fix
  max-height: 340px;
`;

export { StyledDiv };
