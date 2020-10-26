import styled from 'styled-components';
import Button from '@material-ui/core/Button';

// must use display: none instead of conditional rendering to preserve sort history between views
const SelectionButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  color: white;
  height: 40px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  width: 185px;
  ${({ $searchView }) =>
    $searchView === 'table' &&
    `
    display: none;
  `}
`;

export { SelectionButton };
