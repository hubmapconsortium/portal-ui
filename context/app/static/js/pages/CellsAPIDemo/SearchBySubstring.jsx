import React, { useState } from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ResultsTable from './ResultsTable';

// eslint-disable-next-line no-unused-vars
function SearchBySubstring(props) {
  const { targetEntity } = props;

  const [substring, setSubstring] = useState('');
  const [results, setResults] = useState([]);
  const [options, setOptions] = useState([]);

  async function handleSubmit() {
    const urlParams = new URLSearchParams();
    urlParams.append('substring', substring);

    const firstResponse = await fetch(`/cells/${targetEntity}-by-substring.json?${urlParams}`, {
      method: 'POST',
    });
    const responseJson = await firstResponse.json();
    if ('message' in responseJson) {
      console.warn(responseJson.message);
    }
    if ('results' in responseJson) {
      setResults(responseJson.results);
      setOptions(responseJson.results.map((row) => row.full));
    }
  }

  async function handleChange(event) {
    const { target } = event;
    setSubstring(target.value);

    const urlParams = new URLSearchParams();
    urlParams.append('substring', target.value);

    const firstResponse = await fetch(`/cells/${targetEntity}-by-substring.json?${urlParams}`, {
      method: 'POST',
    });
    const responseJson = await firstResponse.json();
    if ('message' in responseJson) {
      console.warn(responseJson.message);
    }
    if ('results' in responseJson) {
      setOptions(responseJson.results.map((row) => row.full));
    }
  }

  return (
    <Paper>
      <Autocomplete
        options={options}
        freeSolo // TODO: only for dev
        renderInput={(params) => (
          // eslint-disable-next-line prettier/prettier
          <TextField
            label="substring"
            value={substring}
            name="substring"
            variant="outlined"
            onChange={handleChange}
            {...params}
          />
        )}
      />
      <br />
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      <ResultsTable results={results} />
    </Paper>
  );
}

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

// export default function Asynchronous() {
//   const [open, setOpen] = React.useState(false);
//   const [options, setOptions] = React.useState([]);
//   const loading = open && options.length === 0;

//   React.useEffect(() => {
//     let active = true;

//     if (!loading) {
//       return undefined;
//     }

//     (async () => {
//       const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
//       await sleep(1e3); // For demo purposes.
//       const countries = await response.json();

//       if (active) {
//         setOptions(Object.keys(countries).map((key) => countries[key].item[0]));
//       }
//     })();

//     return () => {
//       active = false;
//     };
//   }, [loading]);

//   React.useEffect(() => {
//     if (!open) {
//       setOptions([]);
//     }
//   }, [open]);

//   return (
//     <Autocomplete
//       id="asynchronous-demo"
//       style={{ width: 300 }}
//       open={open}
//       onOpen={() => {
//         setOpen(true);
//       }}
//       onClose={() => {
//         setOpen(false);
//       }}
//       getOptionSelected={(option, value) => option.name === value.name}
//       getOptionLabel={(option) => option.name}
//       options={options}
//       loading={loading}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label="Asynchronous"
//           variant="outlined"
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <React.Fragment>
//                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                 {params.InputProps.endAdornment}
//               </React.Fragment>
//             ),
//           }}
//         />
//       )}
//     />
//   );
// }

export default SearchBySubstring;
