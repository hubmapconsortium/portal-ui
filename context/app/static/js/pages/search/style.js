import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

const SearchHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 2.5rem;
  margin-right: ${(props) => props.theme.spacing(0.5)};
`;

const SearchEntityHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

export { SearchHeader, StyledSvgIcon, SearchEntityHeader };
