import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';

const SearchHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 2.5rem;
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`;

const SearchEntityHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { SearchHeader, StyledSvgIcon, SearchEntityHeader };
