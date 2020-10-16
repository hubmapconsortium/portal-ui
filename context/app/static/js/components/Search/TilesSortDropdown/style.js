import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const SelectionButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  color: white;
  ${({ searchView }) =>
    searchView === 'table' &&
    `
    display: none;
  `}
`;

export { SelectionButton };
