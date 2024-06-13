import styled from 'styled-components';

// This import doesn't work at test-time, so pull into a separate file,
// so it doesn't cause problems for other styled components.
import Logo from 'assets/svg/hubmap-logo.svg';

const HubmapLogo = styled(Logo)`
  margin-right: 10px;
  fill: ${(props) => props.theme.palette.white.main};
  height: 20px;
`;

export default HubmapLogo;
