import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export { StyledAccordion };
