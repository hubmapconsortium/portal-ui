import styled from 'styled-components';

const StyledImage = styled.div`
  mask-image: ${(props) => `url(${props.iconURL})`};
  mask-repeat: no-repeat;
  background-color: ${(props) => props.theme.palette.primary.main};
  width: 25px;
  height: 25px;
`;

export { StyledImage };
