import { ReactNode } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';

import { Severity, SnackbarMessage } from './types';

interface SnackbarProviderState {
  message?: SnackbarMessage;
  snackbarOpen: boolean;
  openSnackbar: (newMessage: ReactNode, severity?: Severity, key?: string | number) => void;
  closeSnackbar: () => void;
  toastInfo: (message: ReactNode, key?: string | number) => void;
  toastSuccess: (message: ReactNode, key?: string | number) => void;
  toastWarning: (message: ReactNode, key?: string | number) => void;
  toastError: (message: ReactNode, key?: string | number) => void;
}

const { Provider, useStore } = createContext<SnackbarProviderState>();

const formatMessage = (
  newMessage: ReactNode,
  severity: Severity = 'info',
  key: string | number = new Date().getTime(),
) => {
  const message: SnackbarMessage = {
    message: newMessage,
    severity,
    key,
  };
  return message;
};

const createStore = () =>
  create<SnackbarProviderState>((set, get) => ({
    message: undefined,
    snackbarOpen: false,
    openSnackbar: (newMessage, severity = 'info', key = new Date().getTime()) => {
      set({
        snackbarOpen: true,
        message: formatMessage(newMessage, severity, key),
      });
    },
    closeSnackbar: () => {
      set({
        snackbarOpen: false,
        message: undefined,
      });
    },
    toastInfo: (message, key) => get().openSnackbar(message, 'info', key),
    toastSuccess: (message, key) => get().openSnackbar(message, 'success', key),
    toastError: (message, key) => get().openSnackbar(message, 'error', key),
    toastWarning: (message, key) => get().openSnackbar(message, 'warning', key),
  }));

const useSnackbarActions = () => {
  return useStore((store) => ({
    toastError: store.toastError,
    toastInfo: store.toastInfo,
    toastWarning: store.toastWarning,
    toastSuccess: store.toastSuccess,
    closeSnackbar: store.closeSnackbar,
  }));
};

export { Provider as SnackbarProvider, useStore as useSnackbarStore, createStore, useSnackbarActions };
