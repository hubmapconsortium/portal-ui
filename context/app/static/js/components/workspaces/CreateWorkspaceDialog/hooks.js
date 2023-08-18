import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    'workspace-name': yup.string().required().max(150),
  })
  .required();

function useCreateWorkspace({ handleCreateWorkspace, defaultName }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '' || defaultName,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  function onSubmit({ 'workspace-name': workspaceName }) {
    handleCreateWorkspace({ workspaceName });
    reset();
    handleClose();
  }

  return { dialogIsOpen, setDialogIsOpen, handleClose, handleSubmit, control, errors, onSubmit };
}

export { useCreateWorkspace };
