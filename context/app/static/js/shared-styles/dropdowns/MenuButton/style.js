import styled, { css } from 'styled-components';
import { UpIcon, DownIcon } from 'js/shared-styles/icons';

const iconStyles = css`
  font-size: 1.25rem;
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledUpIcon = styled(UpIcon)`
  ${iconStyles}
`;

const StyledDownIcon = styled(DownIcon)`
  ${iconStyles}
`;

export { StyledUpIcon, StyledDownIcon };
