import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StyledTableContainer, StyledLink } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import { readCookie } from '../../../helpers/functions';

const columns = [
  { id: 'rel_path', label: 'File' },
  { id: 'size', label: 'File Size' },
  { id: 'type', label: 'Type' },
];

function FileTable(props) {
  const { files: rows, assetsEndpoint, uuid } = props;
  const token = readCookie('nexus_token');
  return (
    <SectionContainer id="files">
      <SectionHeader variant="h3" component="h2">
        Files
      </SectionHeader>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.rel_path}>
                  <TableCell>
                    <StyledLink
                      href={`${assetsEndpoint}/${uuid}/${row.rel_path}?token=${token}`}
                      variant="body1"
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      {row.rel_path}
                    </StyledLink>
                  </TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{row.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </SectionContainer>
  );
}

FileTable.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      rel_path: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
    }),
  ).isRequired,
  assetsEndpoint: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default FileTable;
