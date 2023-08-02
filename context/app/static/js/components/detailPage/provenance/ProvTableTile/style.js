import styled from 'styled-components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const DownIcon = styled(KeyboardArrowDownIcon)`
  font-size: 2rem;
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

export { DownIcon };
