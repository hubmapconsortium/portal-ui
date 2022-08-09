import styled from 'styled-components';

import DropdownLink from '../DropdownLink';

const TruncatedSpan = styled.span`
  text-transform: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const WarningDropdownLink = styled(DropdownLink)`
  color: ${(props) => props.theme.palette.warning.dark};
`;

export { TruncatedSpan, WarningDropdownLink };
