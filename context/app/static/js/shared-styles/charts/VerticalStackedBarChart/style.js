import styled from 'styled-components';

const TitleAndLegendWrapper = styled.div`
  padding-left: ${(props) => props.$leftOffset}px;
`;

const CenteredFlex = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: ${(props) => props.theme.spacing(1)}px;
`;

export { TitleAndLegendWrapper, CenteredFlex };
