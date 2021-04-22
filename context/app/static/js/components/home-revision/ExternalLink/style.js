import styled from 'styled-components';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';

const Flex = styled.div`
  padding: ${(props) => props.theme.spacing(1)}px;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
`;

const StyledExternalIcon = styled(OpenInNewRoundedIcon)`
  font-size: 1.2rem;
  vertical-align: middle;
`;

export { Flex, StyledExternalIcon };
