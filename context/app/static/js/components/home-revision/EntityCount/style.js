import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';

const Flex = styled.div`
  display: flex;
  padding: 20px;
  flex-grow: 1;
  &:hover {
    background-color: ${(props) => props.theme.palette.primary.light};
    color: #fff;

    svg {
      color: #fff;
    }
  }
`;

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 4.5rem;
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

export { Flex, StyledSvgIcon };
