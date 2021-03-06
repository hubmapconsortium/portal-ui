import styled from 'styled-components';
import CancelIcon from '@material-ui/icons/CancelRounded';

const StyledCancelIcon = styled(CancelIcon)`
  font-size: 1.2rem;
  margin: 0 8px;
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
`;

const SelectedFilterDiv = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.palette.hoverShadow.main};
  border-radius: 8px;
  margin: 8px 8px 0 0;
  display: flex;
  padding: 10px 0 10px 10px;
`;

export { StyledCancelIcon, SelectedFilterDiv };
