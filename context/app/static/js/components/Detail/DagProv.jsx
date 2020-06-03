/* eslint-disable react/no-array-index-key */
import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';

const ListKey = styled.span`
  font-weight: bold;
  margin-right: 4px;
`;

const PaddedPaper = styled(Paper)`
  padding: 30px 40px 30px 40px;
`;

function DagList(props) {
  const { dagListData } = props;
  return (
    <>
      <Typography variant="h5" component="h3" color="primary">
        dag_provenance_list
      </Typography>
      <List>
        {dagListData.map((item, i) => (
          <React.Fragment key={`dag-provenance-list-item${i}`}>
            {i !== 0 && <Divider />}
            <li>
              {Object.entries(item).map(([key, value]) => (
                <Typography key={key} variant="body1">
                  <ListKey>{key}: </ListKey>
                  {value}
                </Typography>
              ))}
            </li>
          </React.Fragment>
        ))}
      </List>
    </>
  );
}

function DagProv(props) {
  const { dagListData } = props;
  return (
    <SectionContainer id="dag-provenance">
      <SectionHeader variant="h3" component="h2">
        DAG Provenance
      </SectionHeader>
      <PaddedPaper>{dagListData && <DagList dagListData={dagListData} />}</PaddedPaper>
    </SectionContainer>
  );
}

export default DagProv;
