import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Providers from '../Providers';
import Footer from '../Footer';
import { Header } from '../Header';

import { Background, StyledContainer } from './style';

function Maintenance() {
  return (
    <Providers>
      <Header isMaintenanceMode />
      <Background className="main-content">
        <StyledContainer maxWidth="md">
          <Card>
            <CardContent>
              <Typography variant="h2" component="h1">
                Portal Maintenance
              </Typography>
              <Typography variant="subtitle1">Portal unavailable for scheduled maintenance.</Typography>
              <Typography variant="body1">
                While the portal is under maintenance, visit the{' '}
                <a href="https://hubmapconsortium.org/">HuBMAP Consortium</a> website.
              </Typography>
            </CardContent>
          </Card>
        </StyledContainer>
      </Background>
      <Footer isMaintenanceMode />
    </Providers>
  );
}

export default Maintenance;
