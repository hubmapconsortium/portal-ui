import styled, { css } from 'styled-components';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';

import { panelBorderStyles } from 'js/shared-styles/panels/Panel/style';

const StyledSectionPaper = styled(SectionPaper)`
  ${(props) =>
    !props.$isCollectionPublication &&
    css`
      margin-top: ${props.theme.spacing(3)};
    `}
  ${(props) => panelBorderStyles(props.theme)}
`;

export { StyledSectionPaper };
