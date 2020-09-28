import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';

const headerHeight = 64;

const FixedHeightAppBar = styled(AppBar)`
  height: ${headerHeight}px;
`;

export { FixedHeightAppBar, headerHeight };
