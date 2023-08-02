import styled, { css } from 'styled-components';

import AccordionSummary from '@mui/material/AccordionSummary';

const PrimaryColorAccordionSummary = styled(AccordionSummary)`
  ${(props) =>
    props.$isExpanded &&
    css`
      background-color: ${props.$isExpanded ? props.theme.palette.primary.main : '#E0E0E0'};

      div > * {
        color: ${props.$isExpanded ? '#fff' : props.theme.palette.text.primary};
      }
    `}
`;

export { PrimaryColorAccordionSummary };
