import styled from 'styled-components';
import Button from '@mui/material/Button';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';

// must use display: none instead of conditional rendering to preserve sort history between views
const StyledButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)};
  color: white;
  height: 40px;
  margin-right: ${(props) => props.theme.spacing(1)};
  border-radius: 3px;
  width: 185px;
  ${({ $searchView }) =>
    $searchView === 'table' &&
    `
    display: none;
  `}
`;

const StyledDropdownListboxOption = styled(DropdownListboxOption)`
  min-width: 185px;
`;

export { StyledButton, StyledDropdownListboxOption };
