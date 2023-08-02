import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';

function ContributorsTable({ title, contributors = [], iconTooltipText }) {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
  ];

  return (
    <DetailPageSection id={title.toLowerCase()} data-testid={title.toLowerCase()}>
      <SectionHeader iconTooltipText={iconTooltipText}>{title}</SectionHeader>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <HeaderCell
                    key={column.id}
                    data-testid={`${title.toLowerCase()}-${column.label.toLowerCase()}-header`}
                  >
                    {column.label}
                  </HeaderCell>
                ))}
                <IconTooltipCell
                  component={HeaderCell}
                  tooltipTitle="Open Researcher and Contributor ID"
                  data-testid={`${title.toLowerCase()}-orcid-header`}
                >
                  ORCID
                </IconTooltipCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributors.map(({ orcid_id, name, affiliation }) => (
                <TableRow key={orcid_id} data-testid="contributor-row">
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
