const hasKey = <T extends object>(obj: T, k: PropertyKey): k is keyof T => k in obj;
export default hasKey;
