export const compact = <T>(arr: (T | undefined)[]): T[] => arr.filter((x): x is T => !!x);
