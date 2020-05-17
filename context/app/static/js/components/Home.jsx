import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


function Home() {
  return (
    <Container>
      <Typography component="h1" variant="h1">Welcome to HuBMAP</Typography>
      <Typography component="h2" variant="h5">
        Browse our <Link href="/search?entity_type[0]=Donor">donors</Link>
        , <Link href="/search?entity_type[0]=Sample">samples</Link>
        , or <Link href="/search?entity_type[0]=Dataset">datasets</Link>
      </Typography>
    </Container>
  );
}

export default Home;
