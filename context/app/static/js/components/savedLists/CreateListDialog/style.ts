import { styled } from '@mui/material/styles';
import { TitleTextField, DescriptionTextField } from 'js/components/savedLists/listTextFields';

const StyledDescriptionTextField = styled(DescriptionTextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledTitleTextField = styled(TitleTextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export { StyledTitleTextField, StyledDescriptionTextField };
