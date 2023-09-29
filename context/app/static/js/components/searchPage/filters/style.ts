import { styled } from '@mui/material/styles';

import AccordionSummary from '@mui/material/AccordionSummary';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordion = Accordion;
const StyledAccordionSummary = AccordionSummary;

const StyledExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.secondary.main,
}));

export { StyledExpandMoreIcon, StyledAccordion, StyledAccordionSummary };
