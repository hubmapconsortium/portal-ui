import { styled } from '@mui/material/styles';

import SaveEntityButton from 'js/components/savedLists/SaveEntityButton';
import EditSavedStatusButton from 'js/components/savedLists/EditSavedStatusButton';

const StyledSaveEntityButton = styled(SaveEntityButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledEditSavedStatusButton = styled(EditSavedStatusButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export { StyledSaveEntityButton, StyledEditSavedStatusButton };
