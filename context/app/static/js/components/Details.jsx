import React from 'react';
import Box from '@material-ui/core/Box';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Container from '@material-ui/core/Container';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from "@material-ui/core/Link";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import VisTabs from './VisTabs';

export default function Details(props) {
  const assayMetaData = props.assayJSON;
  const provData = props.provJSON;
  const vitData = props.vitJSON;
  return (
    <Container maxWidth="lg">
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Box className={"expansion-header"}> { assayMetaData.description } </Box>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={3} justify="flex-start" direction="row" alignItems="flex-start">
            <Grid item xs>
              <ul>
                <li>
                  <Box mb={2} mt={0}>
                    <span className={'list-header'}> Contributor </span> <br/>
                    {assayMetaData.provenance_user_displayname}
                  </Box>
                </li>
                <li>
                  <Box mb={2} mt={0}>
                    <span className={'list-header'}> Group </span> <br/>
                    {assayMetaData.provenance_group_name}
                  </Box>
                </li>
                <li>
                  <Box mb={2} mt={0}>
                    <span className={'list-header'}> Type </span> <br/>
                    Assay
                  </Box>
                </li>
              </ul>
            </Grid>
            <Grid item xs>
              <ul>
                <li>
                  <Box mb={2} mt={0}>
                    <span className={'list-header'}> Assay ID </span> <br/>
                    {assayMetaData.display_doi}
                  </Box>
                </li>
                <li>
                  <Box mb={2} mt={0}>
                    <span className={'list-header'}> Created </span> <br/>
                    {assayMetaData.created}
                  </Box>
                </li>
                <li>
                  <Box mb={2} mt={0}>
                    <span className={'list-header'}> Modified </span> <br/>
                    {assayMetaData.modified}
                  </Box>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12}>
              {/* Update breadcrumb with links to parent donors and samples. */}
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/donor">
                  Mock Donor ID 567
                </Link>
                <Link color="inherit" href="/sample">
                  Mock Sample ID 32546
                </Link>
                <Typography color="textPrimary">{assayMetaData.assay_id}</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Box mt={2}>
        <Paper>
          <VisTabs provData={provData} vitData={vitData}/>
        </Paper>
      </Box>
    </Container>
  )
};