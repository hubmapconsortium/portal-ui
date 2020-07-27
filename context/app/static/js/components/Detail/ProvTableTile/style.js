import styled from 'styled-components';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDownRounded';

const DownIcon = styled(KeyboardArrowDownIcon)`
  font-size: 2rem;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { DownIcon };
