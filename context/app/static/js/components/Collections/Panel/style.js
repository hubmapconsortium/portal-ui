import styled from 'styled-components';

const PanelWrapper = styled.div`
  padding: 15px 20px;
  border-bottom: 2px solid ${(props) => props.theme.palette.transparentGray.main};
  display: flex;
  justify-content: space-between;
`;

export { PanelWrapper };
