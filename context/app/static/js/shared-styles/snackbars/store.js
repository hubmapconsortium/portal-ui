import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    snackbarOpen: true,
    openSnackbar: () => set({ snackbarOpen: true }),
    closeSnackbar: () => set({ snackbarOpen: false }),
  }));

export { Provider as SnackbarProvider, useStore as useSnackbarStore, createStore };
