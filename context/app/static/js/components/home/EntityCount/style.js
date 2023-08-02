import styled from 'styled-components';

const FlexLink = styled.a`
  display: flex;
  padding: 30px 20px 20px 20px;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${(props) => props.theme.palette.text.primary};

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    justify-content: flex-start;
  }
  &:hover {
    background-color: ${(props) => props.theme.palette.primary.light};
    color: #fff;

    svg {
      color: #fff;
    }

    [role='img'] {
      background-color: #fff;
    }
  }
`;

const StyledDiv = styled.div`
  margin-right: ${(props) => props.theme.spacing(1)};
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    margin-right: ${(props) => props.theme.spacing(2)};
  }
`;

export { FlexLink, StyledDiv };
