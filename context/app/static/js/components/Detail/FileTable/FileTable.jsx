import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from '@material-ui/core';
import { StyledTableContainer, StyledLink } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import { readCookie } from '../../../helpers/functions';

const columns = [
  { id: 'rel_path', label: 'File' },
  { id: 'size', label: 'File Size' },
  { id: 'type', label: 'Type' },
];

function GlobusLink(props) {
  const { uuid, entityEndpoint } = props;
  const [globusUrl, setGlobusUrl] = React.useState(null);
  React.useEffect(() => {
    async function getAndSetGlobusUrl() {
      const response = await fetch(`${entityEndpoint}/entities/dataset/${uuid}`, {
        headers: {
          Authorization: `Bearer ${readCookie('nexus_token')}`,
        },
      });
      if (!response.ok) {
        console.error('Entities API failed', response);
        return;
      }
      // TODO: I have never gotten a non-401 response, so I'm not sure this works.
      const responseGlobusUrl = await response.json();
      setGlobusUrl(responseGlobusUrl);
    }
    getAndSetGlobusUrl();
  }, [entityEndpoint, uuid]);

  return globusUrl && <Link href={globusUrl}>View in Globus File Browser</Link>;
}

function FileTable(props) {
  const { files: rows, assetsEndpoint, uuid, entityEndpoint } = props;
  const token = readCookie('nexus_token');
  return (
    <SectionContainer id="files">
      <SectionHeader variant="h3" component="h2">
        Files
      </SectionHeader>
      <Paper>
        <GlobusLink entityEndpoint={entityEndpoint} uuid={uuid} />
        {Boolean(rows.length) && (
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
        )}
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
  ),
  assetsEndpoint: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

FileTable.defaultProps = {
  files: [],
};

export default FileTable;
