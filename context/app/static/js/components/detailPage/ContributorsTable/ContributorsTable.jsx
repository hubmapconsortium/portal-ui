import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';

function ContributorsTable({ title, contributors = [] }) {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
  ];

  return (
    <DetailPageSection id={title.toLowerCase()}>
      <SectionHeader>{title}</SectionHeader>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
                <IconTooltipCell component={HeaderCell} tooltipTitle="Open Researcher and Contributor ID">
                  ORCID
                </IconTooltipCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributors.map(({ orcid_id, name, affiliation }) => (
                <TableRow key={orcid_id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{affiliation}</TableCell>
                  <TableCell>
                    {orcid_id && (
                      <OutboundIconLink href={`https://orcid.org/${orcid_id}`} variant="body2">
                        {orcid_id}
                      </OutboundIconLink>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </DetailPageSection>
  );
}

ContributorsTable.propTypes = {
  title: PropTypes.string.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContributorsTable;
