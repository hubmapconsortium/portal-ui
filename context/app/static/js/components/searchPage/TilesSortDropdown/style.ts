import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';

interface StyledButtonProps {
  $searchView: string;
}

// must use display: none instead of conditional rendering to preserve sort history between views
const StyledButton = styled(Button)<StyledButtonProps>(({ theme, $searchView }) => ({
  marginLeft: theme.spacing(1),
  color: 'white',
  height: theme.spacing(5),
  marginRight: theme.spacing(1),
  borderRadius: theme.spacing(0.5),
  width: '185px',
  display: $searchView === 'table' ? 'none' : 'block',
}));

const StyledDropdownListboxOption = styled(DropdownListboxOption)({
  minWidth: '185px',
});

export { StyledButton, StyledDropdownListboxOption };
