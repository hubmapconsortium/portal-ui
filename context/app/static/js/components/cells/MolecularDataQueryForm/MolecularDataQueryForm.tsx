import React, { PropsWithChildren, useEffect, useId, useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { useEventCallback } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import IndependentStepAccordion from 'js/shared-styles/accordions/StepAccordion/IndependentStepAccordion';
import { MolecularDataQueryFormState } from './types';
import SubmitButton from './SubmitButton';
import Results from '../MolecularDataQueryResults';

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
      ...initialValues,
    },
  });
  const { setValue, watch } = methods;

  const { toastError } = useSnackbarActions();

  const queryType = watch('queryType');

  // Reset selected options when query type changes
  useEffect(() => {
    setValue('genes', []);
    setValue('proteins', []);
    setValue('cellTypes', []);
    switch (queryType) {
      case 'gene':
        setValue('queryMethod', DEFAULT_GENE_QUERY_METHOD);
        break;
      case 'protein':
        setValue('queryMethod', 'crossModality');
        break;
      case 'cell-type':
        setValue('queryMethod', 'scFind');
        break;
      default:
        console.error('Unexpected query type:', queryType);
        break;
    }
  }, [queryType, setValue]);

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

  const id = `${useId()}-molecular-data-query`;

  const [formIsExpanded, setFormIsExpanded] = useState(true);
  const [resultsAreExpanded] = useState(false);

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
      />
      <IndependentStepAccordion
        index={1}
        summaryHeading="Results"
        id={`${id}-results`}
        content={<Results />}
        isExpanded={resultsAreExpanded || methods.formState.isSubmitSuccessful}
        noProvider
        disabled={!methods.formState.isSubmitSuccessful}
      />
    </FormProvider>
  );
}
