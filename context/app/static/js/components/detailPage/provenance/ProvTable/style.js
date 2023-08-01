import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';

const FlexContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

// 300 = size of tile
const TableColumn = styled.div`
  min-width: 300px;
`;

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 1.25rem;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const ProvTableEntityHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { FlexContainer, FlexColumn, TableColumn, StyledSvgIcon, ProvTableEntityHeader };
