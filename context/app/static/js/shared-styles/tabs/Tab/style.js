import styled, { css } from 'styled-components';
import Tab from '@mui/material/Tab';

const StyledTab = styled(Tab)`
  min-height: 45px;
  ${({ theme: { palette } }) => css`
    color: ${palette.white.main};
    &:hover {
      filter: ${palette.white.hover};
    }
    &.Mui-selected {
      color: ${palette.white.main};
    }
  `}
`;

export { StyledTab };
