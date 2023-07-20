import styled from 'styled-components';

const LinkButton = styled.a`
  color: ${(props) => props.theme.palette.white.main};
  border-radius: 4px;
  background-color: ${(props) => props.theme.palette.primary.main};
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
  box-sizing: content-box;
  padding: 8px 30px;
  text-align: center;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows[8]};
    filter: ${(props) => props.theme.palette.primary.hover};
  }
`;

export { LinkButton };
