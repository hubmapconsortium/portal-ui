import styled from 'styled-components';

const StyledDiv = styled.div`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const ColoredImage = styled.div`
  mask-image: ${(props) => `url(${props.icon})`};
  mask-repeat: no-repeat;
  background-color: ${(props) => props.theme.palette.primary.main};
  width: 25px;
  height: 25px;
`;

export { StyledDiv, ColoredImage };
