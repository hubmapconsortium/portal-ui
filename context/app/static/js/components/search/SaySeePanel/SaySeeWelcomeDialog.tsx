import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import DialogModal from 'js/shared-styles/dialogs/DialogModal';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { List } from './styles';

const LOCAL_STORAGE_KEY = 'hubmap-say-see-welcome-seen';

function hasBeenDismissed() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.localStorage.getItem(LOCAL_STORAGE_KEY));
}

const exampleQuestions = [
  '“What is the proportion of donor sex for each race?”',
  '“Show me a table of all donor metadata.”',
];

const capabilities = [
  'Get visual answers instantly as interactive charts and tables',
  'Apply filters based on your queries to refine your results.',
  'Ask follow-up questions about the metadata.',
  'Download a manifest file or CSVs file of your filtered datasets for bulk analysis.',
];

function SaySeeWelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasBeenDismissed()) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    setIsOpen(false);
  }, []);

  return (
    <DialogModal
      title="Welcome to Say & See Mode (BETA)"
      isOpen={isOpen}
      handleClose={handleClose}
      withCloseButton
      maxWidth="md"
      content={
        <Box>
          <Typography variant="body1" gutterBottom>
            Explore HuBMAP&apos;s public datasets through a natural language chat interface. Ask questions about donor,
            sample, and dataset metadata and get visualizations back.
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            What you can do:
          </Typography>
          <List>
            <Box component="li" key="ask-naturally">
              Ask questions naturally:
              <List>
                {exampleQuestions.map((q) => (
                  <Box component="li" key={q}>
                    {q}
                  </Box>
                ))}
              </List>
            </Box>
            {capabilities.map((c) => (
              <Box component="li" key={c}>
                {c}
              </Box>
            ))}
          </List>
          <Typography variant="subtitle2">Beta Status:</Typography>
          <Typography variant="body1">
            Say &amp; See Mode is in active development. Always verify important findings against the original datasets.{' '}
            <ContactUsLink capitalize /> to share feedback or report an issue to help us improve.
          </Typography>
        </Box>
      }
      actions={
        <Button variant="contained" color="primary" onClick={handleClose}>
          Explore
        </Button>
      }
    />
  );
}

export default SaySeeWelcomeDialog;
