import styled from 'styled-components';
import CancelIcon from '@material-ui/icons/CancelRounded';

const Flex = styled.div`
  display: flex;
  width: 100%;
`;

const CenteredDiv = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
`;

const StyledCancelIcon = styled(CancelIcon)`
  height: 0.8em;
  margin: 0 8px;
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
`;

export { Flex, CenteredDiv, StyledCancelIcon };
