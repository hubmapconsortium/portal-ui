import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { Background, FlexForm, StyledLabel, StyledInput } from './style';

function FacetSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <Background>
      <Container maxWidth="lg">
        <FlexForm>
          <StyledLabel htmlFor="facet-search">
            <Typography variant="h5" component="span">
              Search Portal
            </Typography>
          </StyledLabel>
          <StyledInput
            id="facet-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </FlexForm>
      </Container>
    </Background>
  );
}

export default FacetSearch;
