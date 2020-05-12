import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import VisTabs from './VisTabs';
import RecursiveList from './RecursiveList';

function Details(props) {
  const { assayMetaData, provData } = props;
  const generateListTemplate = (header, description) => (
    <li>
      <Box mb={2} mt={0}>
        <span className="list-header">{header}</span><br />
        {description}
      </Box>
    </li>
  );

  return (
    <Container maxWidth="lg">
      {/* eslint-disable-next-line react/jsx-boolean-value */}
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="Details Panel" id="details-header">
          <Box className="expansion-header">{assayMetaData.description || assayMetaData.display_doi}</Box>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={3} justify="flex-start" direction="row" alignItems="flex-start">
            <Grid item xs>
              <ul>
                {generateListTemplate('Contributor', assayMetaData.created_by_user_displayname)}
                {generateListTemplate('Group', assayMetaData.group_name)}
                {generateListTemplate('Type', assayMetaData.entity_type)}
              </ul>
            </Grid>
            <Grid item xs>
              <ul>
                {generateListTemplate('Assay ID', assayMetaData.display_doi)}
                {generateListTemplate('Created', new Date(assayMetaData.create_timestamp).toDateString())}
                {generateListTemplate('Modified', new Date(assayMetaData.last_modified_timestamp).toDateString()) }
              </ul>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Box mt={2} mb={2}>
        <Paper>
          <VisTabs provData={provData} assayMetaData={assayMetaData} />
        </Paper>
      </Box>
      <RecursiveList property={assayMetaData} propertyName="Root Property" isRoot />
    </Container>
  );
}

Details.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  assayMetaData: PropTypes.object.isRequired,
  provData: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default Details;
