import React from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Publication(props) {
  const { titles } = props;

  return (
    <>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Publications
        </SectionHeader>
        <Paper>
          <Table>
            <TableBody>
              {Object.entries(titles).map(([path, title]) => (
                <TableRow key={path}>
                  <TableCell>
                    <LightBlueLink href={`publication/${path}`}>{title}</LightBlueLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </SectionContainer>
    </>
  );
}

export default Publication;
