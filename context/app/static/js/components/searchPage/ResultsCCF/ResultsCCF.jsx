import React from 'react';
import PropTypes from 'prop-types';

function ReplaceMeWithWebComponent({ spatialResults }) {
  // TODO: This will be replaced with a Web Component from Bruce.
  return (
    <div>
      {spatialResults.map((result) => (
        <pre key={result.uuid}>{JSON.stringify(result, null, 2)}</pre>
      ))}
    </div>
  );
}

function ResultsCCF({ hits }) {
  const spatialResults = hits
    // eslint-disable-next-line no-underscore-dangle
    .map((hit) => hit._source)
    .filter((source) => source.rui_location)
    .map((source) => ({
      uuid: source.uuid,
      rui_location: JSON.parse(source.rui_location),
    }));
  return <ReplaceMeWithWebComponent spatialResults={spatialResults} />;
}

ResultsCCF.propTypes = {
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      sort: PropTypes.array,
      _id: PropTypes.string,
      _index: PropTypes.string,
      _score: PropTypes.number,
      _source: PropTypes.object,
      _type: PropTypes.string,
    }),
  ),
};

ResultsCCF.defaultProps = {
  hits: undefined,
};

export default ResultsCCF;
