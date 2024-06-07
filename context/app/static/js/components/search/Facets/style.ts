import { styled } from '@mui/material/styles';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const InnerAccordionDetails = styled(AccordionDetails)({
  flexDirection: 'column',
  padding: '4px 10px 4px 16px',
});

const InnerAccordionSummary = styled(AccordionSummary)({
  justifyContent: 'left',
  padding: '0px 16px 0px 16px',
  '& > *': {
    flexGrow: 'unset',
    padding: 0,
    margin: 0,
    color: '#000',
  },
  margin: 0,
});

const StyledExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.secondary.main,
}));

const iconSize = {
  fontSize: '1.2rem',
};

const StyledCheckBoxIcon = styled(CheckBoxIcon)({
  ...iconSize,
});

const StyledCheckBoxBlankIcon = styled(CheckBoxOutlineBlankIcon)({
  ...iconSize,
});

const StyledCheckbox = styled(Checkbox)({
  padding: '3px',
});

const StyledFormControlLabel = styled(FormControlLabel)({
  margin: '0px',
  width: '100%',
  'span:nth-child(2)': {
    flexGrow: 1,
  },
  alignItems: 'start',
});

const StyledStack = styled(Stack)<{ $active: boolean }>(({ theme, $active }) => ({
  cursor: 'pointer',
  p: {
    fontSize: theme.typography.subtitle2.fontSize,
    ...($active && { fontWeight: theme.typography.subtitle1.fontWeight }),
  },
}));

const FormLabelText = styled(Typography)({
  marginRight: '2px',
});

export {
  StyledCheckBoxBlankIcon,
  StyledCheckBoxIcon,
  StyledCheckbox,
  StyledFormControlLabel,
  InnerAccordionDetails,
  InnerAccordionSummary,
  StyledExpandMoreIcon,
  StyledStack,
  FormLabelText,
};
