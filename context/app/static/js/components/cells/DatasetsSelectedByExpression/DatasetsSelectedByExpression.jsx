import React, { useState, useContext } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import LogSlider from 'js/shared-styles/inputs/LogSlider';
import CellsService from 'js/components/cells/CellsService';
import AutocompleteEntity from 'js/components/cells/AutocompleteEntity';
import { AppContext } from 'js/components/Providers';
import { fetchSearchData } from 'js/hooks/useSearchData';
import Slider from 'js/shared-styles/inputs/Slider';
import { StyledDiv, StyledTextField } from './style';

function getSearchQuery(cellsResults) {
  return {
    size: 10000,
    post_filter: {
      bool: {
        must: [
          {
            term: {
              'entity_type.keyword': 'Dataset',
            },
          },
          {
            terms: {
              uuid: cellsResults.map((result) => result.uuid),
            },
          },
        ],
      },
    },
    _source: [
      'uuid',
      'hubmap_id',
      'mapped_data_types',
      'origin_sample.mapped_organ',
      'donor',
      'last_modified_timestamp',
    ],
  };
}

function DatasetsSelectedByExpression({
  completeStep,
  setResults,
  minExpressionLog,
  setMinExpressionLog,
  minCellPercentage,
  setMinCellPercentage,
  cellVariableNames,
  setCellVariableNames,
  queryType,
  setIsLoading,
}) {
  const [message, setMessage] = useState(null);
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const [genomicModality, setGenomicModality] = useState('rna');

  function handleSelectModality(event) {
    setGenomicModality(event.target.value);
  }

  async function handleSubmit() {
    setIsLoading(true);
    setResults([]);
    const queryParams = {
      type: queryType,
      cellVariableNames,
      minExpression: 10 ** minExpressionLog,
      minCellPercentage,
    };
    if (queryType === 'gene') {
      queryParams.modality = genomicModality;
    }
    try {
      completeStep(
        <>
          {cellVariableNames.join(', ')} | Expression Level 10<sup>{minExpressionLog}</sup> | {minCellPercentage}% Cell
          Percentage
        </>,
      );
      const serviceResults = await new CellsService().getDatasets(queryParams);
      const searchResults = await fetchSearchData(getSearchQuery(serviceResults), elasticsearchEndpoint, groupsToken);
      setResults(searchResults.hits.hits);
      setIsLoading(false);
    } catch (e) {
      setMessage(e.message);
      // TODO: The message is displayed in this component...
      // but after the user submits their data, the component collapses,
      // so the message is hidden, and the user just sees the please wait.
      // Not sure what the best long term solution is, but this unblocks Nils.
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  return (
    <StyledDiv>
      <AutocompleteEntity
        targetEntity={`${queryType}s`}
        setter={setCellVariableNames}
        cellVariableNames={cellVariableNames}
        setCellVariableNames={setCellVariableNames}
      />
      {queryType === 'gene' && (
        <StyledTextField
          id="modality-select"
          label="Genomic Modaility"
          value={genomicModality}
          onChange={handleSelectModality}
          variant="outlined"
          select
          fullWidth
          SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            },
          }}
          helperText="Query measurement refers to Gene Expression (RNA) or DNA Accessibility (ATAC)."
        >
          <MenuItem value="rna">Gene Expression (RNA)</MenuItem>
          <MenuItem value="atac">DNA Accessibility (ATAC)</MenuItem>
        </StyledTextField>
      )}
      <div>
        <LogSlider
          label="Minimum Expression Level"
          helperText="Set the minimum gene expression level to refine your dataset selections."
          value={minExpressionLog}
          minLog={-4}
          maxLog={5}
          onChange={(e, val) => setMinExpressionLog(val)}
          id="min-expression"
        />
      </div>
      <div>
        <Slider
          label="Minimum Cell Percentage (%)"
          helperText="Set the minimum cell percentage for cells in the datasets to represent the minimum expression level."
          value={minCellPercentage}
          min={0}
          max={10}
          marks={[0, 1, 2, 5, 10].map((m) => ({ value: m, label: m }))}
          onChange={(e, val) => setMinCellPercentage(val)}
          id="min-cell-percentage"
        />
      </div>
      <div>
        <Button onClick={handleSubmit} disabled={cellVariableNames.length === 0} variant="contained" color="primary">
          Run Query
        </Button>
      </div>
      <Typography>{message}</Typography>
    </StyledDiv>
  );
}

export default DatasetsSelectedByExpression;
