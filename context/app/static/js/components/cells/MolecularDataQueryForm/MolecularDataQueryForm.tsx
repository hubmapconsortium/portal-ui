import React, { PropsWithChildren, useEffect, useId, useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { useEventCallback } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import IndependentStepAccordion from 'js/shared-styles/accordions/StepAccordion/IndependentStepAccordion';
import { MolecularDataQueryFormState } from './types';
import SubmitButton from './SubmitButton';
import Results from '../MolecularDataQueryResults';
import CurrentQueryParametersDisplay from './CurrentQueryParametersDisplay';
import CurrentQueryResultsDisplay from './CurrentQueryResultsDisplay';

interface MolecularDataQueryFormProps extends PropsWithChildren {
  initialValues?: Partial<MolecularDataQueryFormState>;
}

const DEFAULT_GENE_QUERY_METHOD = 'crossModalityRNA';

export default function MolecularDataQueryForm({ children, initialValues }: MolecularDataQueryFormProps) {
  const methods = useForm<MolecularDataQueryFormState>({
    defaultValues: {
      queryType: 'gene',
      queryMethod: DEFAULT_GENE_QUERY_METHOD,
      genes: [],
      minimumCellPercentage: 5,
      minimumExpressionLevel: 1,
      ...initialValues,
    },
  });
  const { watch, reset } = methods;

  const { toastError } = useSnackbarActions();

  const queryType = watch('queryType');
  const threshold = watch('minimumCellPercentage');
  const expression = watch('minimumCellPercentage');
  const genes = watch('genes');
  const proteins = watch('proteins');
  const cellTypes = watch('cellTypes');

  // Reset selected options when query type changes
  useEffect(() => {
    const queryMethod = {
      gene: DEFAULT_GENE_QUERY_METHOD,
      protein: 'crossModality',
      'cell-type': 'scFind',
    }[queryType];

    reset(
      {
        genes: [],
        proteins: [],
        cellTypes: [],
        // @ts-expect-error - some annoying conflicts between queryType and queryMethod
        queryType,
        // @ts-expect-error - some annoying conflicts between queryType and queryMethod
        queryMethod,
        ...initialValues,
      },
      {
        keepDirty: false,
        keepIsSubmitSuccessful: false,
        keepIsSubmitted: false,
      },
    );
  }, [queryType, reset, initialValues]);

  const onSubmit = useEventCallback((data: MolecularDataQueryFormState) => {
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
    // prevent the query from running until the form is submitted again.
    reset(undefined, {
      keepIsSubmitted: false,
      keepIsSubmitSuccessful: false,
      keepValues: true,
      keepDirty: false,
    });
  }, [threshold, expression, genes, proteins, cellTypes, reset]);

  const id = `${useId()}-molecular-data-query`;

  const [formIsExpanded, setFormIsExpanded] = useState(false);

  const toggleParametersSection = useEventCallback(() => {
    setFormIsExpanded((prev) => !prev);
  });

  return (
    <FormProvider {...methods}>
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
        completedStepText={<CurrentQueryParametersDisplay />}
      />
      <IndependentStepAccordion
        index={1}
        summaryHeading="Results"
        id={`${id}-results`}
        content={<Results />}
        isExpanded={methods.formState.isSubmitSuccessful}
        noProvider
        disabled={!methods.formState.isSubmitSuccessful}
        completedStepText={<CurrentQueryResultsDisplay />}
      />
    </FormProvider>
  );
}
