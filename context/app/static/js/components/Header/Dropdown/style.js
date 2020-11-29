import styled from 'styled-components';
import Popper from '@material-ui/core/Popper';

const OffsetPopper = styled(Popper)`
  margin-top: 14px;
  z-index: ${(props) => props.theme.zIndex.dropdownOffset};
`;

export { OffsetPopper };
