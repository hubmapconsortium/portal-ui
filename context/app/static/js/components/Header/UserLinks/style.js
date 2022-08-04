import styled from 'styled-components';

const TruncatedSpan = styled.span`
  text-transform: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const WarningSpan = styled.span`
  color: ${(props) => props.theme.palette.warning.dark};
`;

export { TruncatedSpan, WarningSpan };
