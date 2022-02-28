import styled from 'styled-components';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';

const StyledOpenInNewRoundedIcon = styled(OpenInNewRoundedIcon)`
  font-size: 1.1rem;
`;

const StyledOutboundLink = styled(OutboundLink)`
  display: flex;
  align-items: center;
`;

export { StyledOpenInNewRoundedIcon, StyledOutboundLink };
