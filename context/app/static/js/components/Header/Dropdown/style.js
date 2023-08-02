import styled from 'styled-components';
import Popper from '@mui/material/Popper';

const OffsetPopper = styled(Popper)`
  margin-top: 14px;
  z-index: ${(props) => props.theme.zIndex.dropdownOffset};
`;

export { OffsetPopper };
