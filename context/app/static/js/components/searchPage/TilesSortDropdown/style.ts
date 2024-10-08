import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';

interface StyledButtonProps {
  $searchView: string;
}

// must use display: none instead of conditional rendering to preserve sort history between views
const StyledButton = styled(Button)<StyledButtonProps>(({ theme, $searchView }) => ({
  margin: theme.spacing(0, 1),
  height: theme.spacing(5),
  borderRadius: theme.spacing(0.5),
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  width: '185px',
  display: $searchView === 'table' ? 'none' : 'block',
}));

const StyledDropdownListboxOption = styled(DropdownListboxOption)({
  minWidth: '185px',
});

export { StyledButton, StyledDropdownListboxOption };
