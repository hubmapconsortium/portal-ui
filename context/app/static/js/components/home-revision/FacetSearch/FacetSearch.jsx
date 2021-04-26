import React, { useState, useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import FacetSearchMenu from 'js/components/home-revision/FacetSearchMenu';
import { Background, FlexForm, StyledLabel, StyledInput } from './style';

const animals = ['cat', 'dog', 'bear'];

function FacetSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const anchorRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      setMatches(animals.filter((animal) => animal.startsWith(searchTerm)));
    } else {
      setMatches([]);
    }
  }, [setMatches, searchTerm]);
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
            ref={anchorRef}
            id="facet-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value.toLocaleLowerCase())}
            autoComplete="off"
          />
          <FacetSearchMenu anchorRef={anchorRef} matches={matches} />
        </FlexForm>
      </Container>
    </Background>
  );
}

export default FacetSearch;
