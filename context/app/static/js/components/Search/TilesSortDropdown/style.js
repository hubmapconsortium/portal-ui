import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { DropdownSelectItem } from 'js/shared-styles/dropdowns';

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

const StyledDropdownSelectItem = styled(DropdownSelectItem)`
  min-width: 185px;
`;

export { SelectionButton, StyledDropdownSelectItem };
