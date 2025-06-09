import React, { PropsWithChildren, useEffect, useId, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useEventCallback } from '@mui/material/utils';
import Stack from '@mui/material/Stack';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import IndependentStepAccordion from 'js/shared-styles/accordions/StepAccordion/IndependentStepAccordion';
import { MolecularDataQueryFormProps, MolecularDataQueryFormState } from './types';
import SubmitButton from './SubmitButton';
import Results from '../MolecularDataQueryResults';
import CurrentQueryParametersDisplay from './CurrentQueryParametersDisplay';
import CurrentQueryResultsDisplay from './CurrentQueryResultsDisplay';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';
import { getCellVariableNames, useMolecularDataQueryFormState } from './hooks';
import MolecularDataQueryFormProvider from './MolecularDataQueryFormProvider';

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
  }, [threshold, genes, proteins, cellTypes, reset]);

  const id = `${useId()}-molecular-data-query`;

  const [formIsExpanded, setFormIsExpanded] = useState(false);

  const toggleParametersSection = useEventCallback(() => {
    setFormIsExpanded((prev) => !prev);
  });

  return (
    <>
      <IndependentStepAccordion
        index={0}
        summaryHeading="Parameters"
        id={`${id}-parameters`}
        content={
          <Stack component="form" onSubmit={submit} gap={2}>
            {children}
            <SubmitButton />
          </Stack>
        }
        isExpanded={formIsExpanded || !methods.formState.isSubmitted}
        onChange={toggleParametersSection}
        noProvider
        completedStepText={methods.formState.isSubmitted ? <CurrentQueryParametersDisplay /> : undefined}
      />
      <IndependentStepAccordion
        index={1}
        summaryHeading="Results"
        id={`${id}-results`}
        content={<Results />}
        isExpanded={methods.formState.isSubmitSuccessful}
        noProvider
        disabled={!methods.formState.isSubmitSuccessful}
        completedStepText={methods.formState.isSubmitSuccessful ? <CurrentQueryResultsDisplay /> : undefined}
      />
    </>
  );
}
export default function MolecularDataQueryFormWithProvider({ initialValues, children }: MolecularDataQueryFormProps) {
  return (
    <MolecularDataQueryFormProvider initialValues={initialValues}>
      <MolecularDataQueryForm>{children}</MolecularDataQueryForm>
    </MolecularDataQueryFormProvider>
  );
}
