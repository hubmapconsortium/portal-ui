import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const TableContainer = styled.div`
  margin-right: 30px;
  width: 120px;
`;

const StickyNav = styled.nav`
  position: sticky;
`;

const TableTitle = styled(Typography)`
  margin-left: 7px;
`;

const StyledItemLink = styled(Link)`
  font-size: ${(props) => props.theme.typography.body1.fontSize};
  line-height: 2;
  padding-left: 4px;
  border-left: 3px solid transparent;
  margin-bottom: ${(props) => props.theme.spacing(0.25)}px;
  white-space: nowrap;

  &:hover {
    border-left: 3px solid #c4c4c4; // TODO: Move to theme.
  }
  ${(props) =>
    props.$isCurrentSection &&
    css`
      color: ${props.theme.palette.info.main};
      border-left: 3px solid #c4c4c4; // TODO: Move to theme.
    `};
`;

export { TableContainer, StickyNav, TableTitle, StyledItemLink };
