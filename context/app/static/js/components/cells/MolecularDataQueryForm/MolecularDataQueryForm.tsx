import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
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
import { formValuesToParams, useMolecularDataQueryUrlState } from './urlState';
import { usePathwayAutocompleteQuery } from './AutocompleteEntity/hooks';

type UrlState = ReturnType<typeof useMolecularDataQueryUrlState>;

/**
 * Restores the pathway chip from a shared link.
 *
 * Gated on the form already being submitted: useSelectedPathwayParticipants watches `pathway`
 * and, while the form is unsubmitted, replaces `genes` wholesale with the pathway's participants.
 * Hydrating earlier would therefore discard the gene list the link carried and bounce the user
 * back to the parameters step.
 *
 * ponytail: relies on the auto-submit landing first. A URL carrying a pathway but no genes is not
 * auto-submitted, so it hydrates immediately and the participants effect populates the genes --
 * which is what we want there.
 */
function useHydratePathwayFromUrl({ pathwayCode, hasQuery }: UrlState) {
  const { setValue, formState } = useMolecularDataQueryFormState();
  const { options } = usePathwayAutocompleteQuery('');
  const hydratedRef = useRef(false);

  const canHydrate = formState.isSubmitted || !hasQuery;

  useEffect(() => {
    if (hydratedRef.current || !pathwayCode || !canHydrate) {
      return;
    }
    const match = options.find((option) => option.values?.[0] === pathwayCode);
    if (!match) {
      return;
    }
    hydratedRef.current = true;
    setValue('pathway', match);
  }, [pathwayCode, canHydrate, options, setValue]);
}

interface MolecularDataQueryFormInnerProps extends PropsWithChildren {
  urlState: UrlState;
}

export function MolecularDataQueryForm({ children, urlState }: MolecularDataQueryFormInnerProps) {
  const methods = useMolecularDataQueryFormState();
  const { watch, reset } = methods;
  const { track } = useMolecularDataQueryFormTracking();

  const { toastError } = useSnackbarActions();

  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');
  const genes = watch('genes');
  const cellTypes = watch('cellTypes');

  const [activeStep, setActiveStep] = useState(0);

  // Move to results step when form is successfully submitted. activeStep
  // is also reset to 0 by an explicit "back" button and by the param-reset
  // effect below, so derived state isn't a clean substitute -- the user
  // can navigate back from step 1 while submitSuccessful is still true.
  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveStep(1);
    }
  }, [methods.formState.isSubmitSuccessful]);

  const runQuery = useEventCallback((data: MolecularDataQueryFormState) => {
    const cellVariableNames = getCellVariableNames(queryType, genes, cellTypes);

    // TODO: Once we add pathways, the pathway name should be present here too for gene queries
    track('Parameters / Run Query', `${data.queryType} ${queryMethod} ${cellVariableNames.join(', ')}`);
    methods.reset(data, { keepValues: true, keepDirty: false });
  });

  const onSubmit = useEventCallback((data: MolecularDataQueryFormState) => {
    // Share the query as a link. A query restored from the URL runs through runQuery instead, so
    // that it isn't pushed back onto the history stack it came from.
    void urlState.setQueryParams(formValuesToParams(data), { history: 'push' });
    runQuery(data);
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

    // Reset to parameters step when form parameters change. This effect
    // does double duty (it also calls react-hook-form's reset()), so it
    // can't be replaced by derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveStep(0);
  }, [genes, cellTypes, reset]);

  const autoSubmittedRef = useRef(false);

  // Run a query restored from a shared link so the recipient lands on results. Declared after the
  // reset effect above, which also fires on mount and would otherwise undo this; handleSubmit
  // resolves asynchronously, so isSubmitSuccessful lands after both mount effects.
  useEffect(() => {
    if (autoSubmittedRef.current || !urlState.hasQuery) {
      return;
    }
    autoSubmittedRef.current = true;
    methods
      .handleSubmit(runQuery, onError)()
      .catch((error) => {
        console.error('Error running the query from the URL:', error);
        toastError('An error occurred while running the shared query. Please try again.');
      });
  }, [urlState.hasQuery, methods, runQuery, onError, toastError]);

  useHydratePathwayFromUrl(urlState);

  const handleBackToParameters = useEventCallback(() => {
    setActiveStep(0);
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step index={0}>
          <QueryParametersLabel activeStep={activeStep} handleBackToParameters={handleBackToParameters} />
          <StepContent>
            <Stack
              component="form"
              onSubmit={submit}
              sx={{
                gap: 2,
              }}
            >
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
  const urlState = useMolecularDataQueryUrlState();

  return (
    // Remount on back/forward so a restored URL rebuilds the form through the same path as a cold
    // load, instead of patching the live form around the provider's own reset effects.
    <MolecularDataQueryFormProvider key={urlState.formKey} initialValues={initialValues ?? urlState.initialValues}>
      <MolecularDataQueryForm urlState={urlState}>{children}</MolecularDataQueryForm>
    </MolecularDataQueryFormProvider>
  );
}
