import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set, get) => ({
    messages: [],
    snackbarOpen: false,
    openSnackbar: (newMessage = '') => {
      const currentMessages = get().messages;
      set({ snackbarOpen: true, messages: [...currentMessages, newMessage] });
    },
    closeSnackbar: () => {
      const [, ...remainingMessages] = get().messages;
      if (remainingMessages.length > 0) {
        set({ messages: remainingMessages });
      } else {
        set({ snackbarOpen: false, messages: [] });
      }
    },
  }));

export { Provider as SnackbarProvider, useStore as useSnackbarStore, createStore };
