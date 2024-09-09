import AccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => {
  const primaryColor = theme.palette.primary.main;
  const whiteColor = theme.palette.white.main;

  return {
    '&.Mui-expanded': {
      backgroundColor: primaryColor,
      color: whiteColor,
      '.accordion-icon': {
        color: whiteColor,
      },
    },
    backgroundColor: whiteColor,
    color: primaryColor,
    '.accordion-icon': {
      color: primaryColor,
    },
  };
});

export { StyledAccordionSummary };
