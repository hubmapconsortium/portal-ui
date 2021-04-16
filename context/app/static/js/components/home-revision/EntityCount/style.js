import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';

const Flex = styled.div`
  display: flex;
  padding: 20px;
  flex-grow: 1;
  align-items: center;
  justify-content: center;

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    justify-content: flex-start;
  }
  &:hover {
    background-color: ${(props) => props.theme.palette.primary.light};
    color: #fff;

    svg {
      color: #fff;
    }
  }
`;

const StyledSvgIcon = styled(SvgIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  font-size: 4.5rem;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    margin-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

export { Flex, StyledSvgIcon };
