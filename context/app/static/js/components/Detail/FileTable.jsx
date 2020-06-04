import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';
import { readCookie } from '../../helpers/functions';

const StyledTableContainer = styled(TableContainer)`
  max-height: 600px;
`;

const StyledLink = styled(Link)`
  color: #3781d1;
`;

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
                <TableRow>
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

export default FileTable;
