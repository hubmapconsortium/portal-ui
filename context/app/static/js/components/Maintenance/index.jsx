import React from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Providers from '../Providers';
import Footer from '../Footer';
import { Header } from '../Header';

function Maintenance() {
  return (
    <Providers>
      <Header isMaintenanceMode />
      <div className="main-content">
        <Container
          maxWidth="sm"
          style={{ position: 'absolute', top: '40%', transform: 'translateY(-40%) translateX(-50%)', left: '50%' }}
        >
          <Card>
            <CardContent>
              <h1>Portal Maintenance</h1>
              <p>
                <strong>Portal unavailable for scheduled maintenance.</strong>
              </p>
              <p>
                While the portal is under maintenance, visit the{' '}
                <a href="https://hubmapconsortium.org/">HuBMAP Consortium</a> website.
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
      <Footer isMaintenanceMode />
    </Providers>
  );
}

export default Maintenance;
