export const useOrgansAPI = () => ({
  organDetails(organName: string) {
    return `/organ/${organName}.json`;
  },
  get organList() {
    return `/organs.json`;
  },
});
