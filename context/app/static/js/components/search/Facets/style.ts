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

const FacetAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  flexDirection: 'column',
  padding: theme.spacing(0.5, 0.5, 0.5, 1),
}));

const FacetAccordionSummary = styled(AccordionSummary)<{ $position: 'inner' | 'outer' }>(({ $position, theme }) => ({
  padding: $position === 'outer' ? theme.spacing(0.5, 0) : 0,
  justifyContent: 'left',
  width: '100%',
  '& > *': {
    flexGrow: 'unset',
    padding: 0,
    margin: 0,
    color: '#000',
  },
  margin: 0,
}));

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

const FormLabelText = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(0.25),
}));

const HierarchicalAccordionSummary = styled(AccordionSummary)({
  margin: 0,
  padding: 0,
  '& > div': {
    padding: 0,
    margin: 0,
  },
});

export {
  StyledCheckBoxBlankIcon,
  StyledCheckBoxIcon,
  StyledCheckbox,
  StyledFormControlLabel,
  FacetAccordionDetails,
  FacetAccordionSummary,
  StyledExpandMoreIcon,
  StyledStack,
  FormLabelText,
  HierarchicalAccordionSummary,
};
