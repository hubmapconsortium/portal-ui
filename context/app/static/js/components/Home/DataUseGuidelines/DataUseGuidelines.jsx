import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Background, MainText, StyledLink } from './style';

function DataUseGuidelines() {
  return (
    <Background>
      <Typography component="h2" variant="h4">
        Data Use Guidelines
      </Typography>
      <MainText mt={1} variant="body1">
        The HuBMAP Data Portal allows access to both open and restricted access data and will be guided by the rules set
        by existing NIH GDH Policy and other applicable laws. There may be both controlled and uncontrolled access data
        available through the Data Portal. Permission to access controlled data will be reviewed and granted by a
        designated NIH Data Access Committee.
      </MainText>
      <MainText mt={2}>
        Users of HuBMAP open-data or processed data agree not to use the requested datasets, either alone or in concert
        with any other information, to identify or contact individual participants (or family members) from whom data
        and/or samples were collected.
      </MainText>
      <MainText mt={2}>
        Please direct any questions to{' '}
        <StyledLink variant="body1" href="https://hubmapconsortium.org/" target="_blank" rel="noopener noreferrer">
          link
        </StyledLink>
        .
      </MainText>
    </Background>
  );
}

export default React.memo(DataUseGuidelines);
