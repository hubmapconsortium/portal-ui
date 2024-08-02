import React from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Check } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import InfoAlert from 'js/shared-styles/alerts/InfoAlert';
import { isValidEmail } from 'js/helpers/functions';

import { useNormalizedContributors } from './hooks';
import { ContributorAPIResponse, sortContributors } from './utils';

interface ContributorsTableProps {
  title: string;
  contributors: ContributorAPIResponse[];
  iconTooltipText?: string;
  showInfoAlert?: boolean;
}

function ContributorsTable({ title, contributors = [], iconTooltipText, showInfoAlert }: ContributorsTableProps) {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
    { id: 'contact', label: 'Contact' },
  ];

  const normalizedContributors = useNormalizedContributors(contributors);
  const sortedContributors = sortContributors(normalizedContributors);

  const contributorsInfoAlertText =
    'Below is the information for the individuals who provided this dataset. For questions for this dataset, reach out to the individuals listed as contacts, either via the email address listed in the table or contact information provided on their ORCID profile page.';

  return (
    <DetailPageSection id={title.toLowerCase()} data-testid={title.toLowerCase()}>
      <SectionHeader iconTooltipText={iconTooltipText}>{title}</SectionHeader>
      {showInfoAlert && <InfoAlert text={contributorsInfoAlertText} />}
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
                  tooltipTitle="Open Researcher and Contributor ID"
                  data-testid={`${title.toLowerCase()}-orcid-header`}
                >
                  ORCID
                </IconTooltipCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedContributors.map(
                ({ orcid, name: displayName, affiliation, isContact, email, isPrincipalInvestigator }) => {
                  const contactCell = (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Check color="success" fontSize="1.5rem" />
                      {isValidEmail(email) ? (
                        <EmailIconLink email={encodeURI(email)} iconFontSize="1.1rem">
                          {email}
                        </EmailIconLink>
                      ) : (
                        <Typography variant="body2">no email provided</Typography>
                      )}
                    </Stack>
                  );

                  return (
                    <TableRow key={orcid} data-testid="contributor-row">
                      <TableCell>{`${displayName}${isPrincipalInvestigator ? ' (PI)' : ''}`}</TableCell>
                      <TableCell>{affiliation}</TableCell>
                      <TableCell>{isContact && contactCell}</TableCell>
                      <TableCell>
                        {orcid && (
                          <OutboundIconLink href={`https://orcid.org/${orcid}`} variant="body2">
                            {orcid}
                          </OutboundIconLink>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </DetailPageSection>
  );
}

export default ContributorsTable;
