import { styled } from '@mui/material/styles';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';

import { panelBorderStyles } from 'js/shared-styles/panels/Panel/style';

interface StyledSectionPaperProps {
  $isCollectionPublication?: boolean;
}

const StyledSectionPaper = styled(SectionPaper)<StyledSectionPaperProps>(({ theme, $isCollectionPublication }) => ({
  marginTop: theme.spacing($isCollectionPublication ? 0 : 3),
  ...panelBorderStyles(theme),
}));

export { StyledSectionPaper };
