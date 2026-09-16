import { styled } from '@mui/material/styles';
import { shouldForwardProp } from 'js/helpers/styled';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';

import { panelBorderStyles } from 'js/shared-styles/panels/Panel/style';

interface StyledSectionPaperProps {
  $isCollectionPublication?: boolean;
}

const StyledSectionPaper = styled(SectionPaper, { shouldForwardProp })<StyledSectionPaperProps>(
  ({ theme, $isCollectionPublication }) => ({
    marginTop: theme.spacing($isCollectionPublication ? 0 : 3),
    ...panelBorderStyles(theme),
  }),
);

export { StyledSectionPaper };
