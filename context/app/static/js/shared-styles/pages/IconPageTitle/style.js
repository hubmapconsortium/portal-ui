import styled from 'styled-components';

import HeaderIcon from 'js/shared-styles/icons/HeaderIcon';
import { pageTitleBottomMargin } from 'js/shared-styles/pages/PageTitle/style';

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  ${pageTitleBottomMargin}
`;

const StyledHeaderIcon = styled(HeaderIcon)`
  margin-right: ${(props) => props.theme.spacing(1.5)};
`;

export { FlexContainer, StyledHeaderIcon };
