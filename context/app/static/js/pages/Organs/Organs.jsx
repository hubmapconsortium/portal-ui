import React from 'react';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Organs(props) {
  const { organs } = props;

  return (
    <SectionContainer>
      <SectionHeader variant="h1" component="h1">
        Organs
      </SectionHeader>
      <Paper>
        <Table>
          <TableBody>
            {Object.entries(organs).map(([path, organ]) => (
              <TableRow key={path}>
                <TableCell>
                  <Typography variant="subtitle2" component="h3" color="primary">
                    <LightBlueLink href={`/organ/${path}`}>{organ.name}</LightBlueLink>
                  </Typography>
                  {organ.uberon_short}

                  <dl>
                    <dt>Icon?</dt>
                    <dd>
                      {organ.icon ? (
                        <img src={organ.icon} style={{ width: '50px' }} alt={`Icon for ${organ.name}`} />
                      ) : (
                        'TODO: Ask IU?'
                      )}
                    </dd>
                    <dt>Has IU component?</dt>
                    <dd>{organ.has_iu_component ? 'yes' : 'no'}</dd>
                    <dt>Has Azimuth?</dt>
                    <dd>{organ.azimuth ? 'yes' : 'no'}</dd>
                    <dt>Has Datasets?</dt>
                    <dd>{organ.search.length ? 'yes' : 'no'}</dd>
                  </dl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </SectionContainer>
  );
}

export default Organs;
