import styled from 'styled-components';
import TableBody from '@material-ui/core/TableBody';

const ChipWrapper = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  padding: 12px 15px 12px 15px;
  position: sticky;
  top: 0;
  background-color: #fff;
`;

const ScrollTableBody = styled(TableBody)`
  overflow-y: auto;
  max-height: 600px;
`;

export { ScrollTableBody, ChipWrapper };
