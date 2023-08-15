import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    message: '',
    snackbarOpen: false,
    openSnackbar: (message = '') => set({ snackbarOpen: true, message }),
    closeSnackbar: () => set({ snackbarOpen: false }),
  }));

export { Provider as SnackbarProvider, useStore as useSnackbarStore, createStore };
