import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';
import Providers from '../Providers';
import Footer from '../Footer';
import { Header } from '../Header';

const Background = styled.div`
  background-color: ${(props) => props.theme.palette.warning.main};
  margin-top: -16px; // Override the Header's margin.
`;

function Maintenance() {
  /* TODO: pull styles into JSS */
  return (
    <Providers>
      <Header isMaintenanceMode />
      <Background className="main-content">
        <Container
          maxWidth="md"
          style={{ position: 'absolute', top: '40%', transform: 'translateY(-40%) translateX(-50%)', left: '50%' }}
        >
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
        </Container>
      </Background>
      <Footer isMaintenanceMode />
    </Providers>
  );
}

export default Maintenance;
