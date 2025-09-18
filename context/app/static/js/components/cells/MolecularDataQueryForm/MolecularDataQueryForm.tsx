import React, { PropsWithChildren, useEffect, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useEventCallback } from '@mui/material/utils';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { MolecularDataQueryFormProps, MolecularDataQueryFormState } from './types';
import SubmitButton from './SubmitButton';
import Results from '../MolecularDataQueryResults';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';
import { getCellVariableNames, useMolecularDataQueryFormState } from './hooks';
import MolecularDataQueryFormProvider from './MolecularDataQueryFormProvider';
import QueryParametersLabel from './QueryParametersLabel';
import QueryResultsLabel from './QueryResultsLabel';

export function MolecularDataQueryForm({ children }: PropsWithChildren) {
  const methods = useMolecularDataQueryFormState();
  const { watch, reset } = methods;
  const { track } = useMolecularDataQueryFormTracking();

  const { toastError } = useSnackbarActions();

  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');
  const threshold = watch('minimumCellPercentage');
  const genes = watch('genes');
  const proteins = watch('proteins');
  const cellTypes = watch('cellTypes');

  const [activeStep, setActiveStep] = useState(0);

  // Move to results step when form is successfully submitted
  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      setActiveStep(1);
    }
  }, [methods.formState.isSubmitSuccessful]);

  const onSubmit = useEventCallback((data: MolecularDataQueryFormState) => {
    const cellVariableNames = getCellVariableNames(queryType, genes, proteins, cellTypes);

    // TODO: Once we add pathways, the pathway name should be present here too for gene queries
    track('Parameters / Run Query', `${data.queryType} ${queryMethod} ${cellVariableNames.join(', ')}`);
    methods.reset(data, { keepValues: true, keepDirty: false });
  });

  const onError = useEventCallback((errors: FieldErrors<MolecularDataQueryFormState>) => {
    const error = Object.values(errors)
      .map((field) => field.message)
      .join(' ');
    toastError(error);
  });

  const submit = useEventCallback((event: React.FormEvent<HTMLFormElement>) => {
    methods
      .handleSubmit(
        onSubmit,
        onError,
      )(event)
      .catch((error) => {
        console.error('Error in form submission:', error);
        toastError('An error occurred during form submission. Please try again.');
      });
  });

  useEffect(() => {
    // Reset the form submission state when any query fields change
    // This is to ensure that updating the parameters while the form is submitted
    // does not immediately trigger a re-query for results
    // Per the react-hook-form docs, it's recommended to do this reset
    // in useEffect as execution order matters

    // TODO: With this approach, the query still reruns and gets discarded after the first change since the
    // form state is reset AFTER the swr hook gets new params. We should investigate if there is a way to
    // prevent the query from running until the form is submitted again. Maybe switch to a mutation?
    reset(undefined, {
      keepIsSubmitted: false,
      keepIsSubmitSuccessful: false,
      keepValues: true,
      keepDirty: false,
    });

    // Reset to parameters step when form parameters change
    setActiveStep(0);
  }, [threshold, genes, proteins, cellTypes, reset]);

  const handleBackToParameters = useEventCallback(() => {
    setActiveStep(0);
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step index={0}>
          <QueryParametersLabel activeStep={activeStep} handleBackToParameters={handleBackToParameters} />
          <StepContent>
            <Stack component="form" onSubmit={submit} gap={2}>
              {children}
              <SubmitButton />
            </Stack>
          </StepContent>
        </Step>
        <Step index={1} completed={activeStep === 1} last>
          <QueryResultsLabel activeStep={activeStep} />
          <StepContent>
            <Results />
          </StepContent>
        </Step>
      </Stepper>
    </Paper>
  );
}
export default function MolecularDataQueryFormWithProvider({ initialValues, children }: MolecularDataQueryFormProps) {
  return (
    <MolecularDataQueryFormProvider initialValues={initialValues}>
      <MolecularDataQueryForm>{children}</MolecularDataQueryForm>
    </MolecularDataQueryFormProvider>
  );
}
