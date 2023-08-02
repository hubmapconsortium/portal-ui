import styled, { css } from 'styled-components';
import { UpIcon, DownIcon } from 'js/shared-styles/icons';

const iconStyles = css`
  margin-left: ${(props) => props.theme.spacing(0.5)};
`;

const StyledUpIcon = styled(UpIcon)`
  ${iconStyles}
`;

const StyledDownIcon = styled(DownIcon)`
  ${iconStyles}
`;

export { StyledUpIcon, StyledDownIcon };
