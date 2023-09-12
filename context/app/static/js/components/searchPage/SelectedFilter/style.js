import styled from 'styled-components';
import CancelIcon from '@mui/icons-material/CancelRounded';

const StyledCancelIcon = styled(CancelIcon)`
  font-size: 1.2rem;
  margin: 0 8px;
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
`;

const SelectedFilterDiv = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.palette.common.hoverShadow};
  border-radius: 8px;
  margin: 8px 8px 0 0;
  display: flex;
  padding: 10px 0 10px 10px;
`;

export { StyledCancelIcon, SelectedFilterDiv };
