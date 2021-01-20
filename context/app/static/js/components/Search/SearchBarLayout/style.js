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
  height: 1.2rem;
  margin: 0 8px;
  color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
`;

const SelectedFilterDiv = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.palette.hoverShadow.main};
  border-radius: 8px;
  margin: 16px 16px 0 0;
  display: flex;
  padding: 10px 0 10px 10px;
  font-size: 14px;
  line-height: 20px;
`;

const SelectedFilterName = styled.div`
  font-weight: 200 !important;
  color: #000;
`;

export { Flex, CenteredDiv, StyledCancelIcon, SelectedFilterDiv, SelectedFilterName };
