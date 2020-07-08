import styled from 'styled-components';

const LinkButton = styled.a`
  color: #ffffff;
  border-radius: 4px;
  background-color: ${(props) => props.theme.palette.primary.main};
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
  margin-top: ${(props) => props.theme.spacing(1)}px;
`;

const HoverOverlay = styled.div`
  width: 175px;
  padding: 8px 30px;
  box-sizing: content-box;
  text-align: center;
  &:hover {
    background-color: ${(props) => props.theme.palette.primaryHoverOverlay.main};
  }
`;

export { LinkButton, HoverOverlay };
